import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

// Use a more specific type than 'any'
type OutputElement = Record<string, unknown>;

export async function gemini_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gemini-1.5-flash", 
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";
  
  // Get the generative model
  const genModel = genAI.getGenerativeModel({ model });

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    // if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    // if input is in a list format, ask it to generate json in a list
    if (list_input) {
      output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    }

    // Add instruction to format response as JSON without markdown code blocks
    output_format_prompt += `\nVery important: Return ONLY the JSON response without any markdown code blocks, explanation, or additional text.`;

    try {
      // Build the prompt
      const finalPrompt = system_prompt + output_format_prompt + error_msg;
      
      // Create a chat session
      const chat = genModel.startChat({
        generationConfig: {
          temperature: temperature,
        },
      });
      
      // Send the message
      const result = await chat.sendMessage([
        { text: finalPrompt },
        { text: Array.isArray(user_prompt) ? user_prompt.join("\n") : user_prompt.toString() }
      ]);
      const response = result.response;
      let res: string = response.text().trim();
      
      // Extract JSON if it's in a code block
      const jsonMatch = res.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        res = jsonMatch[1].trim();
      }
      
      // Replace single quotes with double quotes for JSON parsing
      res = res.replace(/'/g, '"');
      
      // Ensure we don't replace apostrophes in text
      res = res.replace(/(\w)"(\w)/g, "$1'$2");

      if (verbose) {
        console.log("System prompt:", finalPrompt);
        console.log("\nUser prompt:", user_prompt);
        console.log("\nGemini response:", res);
      }

      // try-catch block to ensure output format is adhered to
      try {
        let output = JSON.parse(res) as unknown;

        if (list_input) {
          if (!Array.isArray(output)) {
            throw new Error("Output format not in a list of json");
          }
        } else {
          output = [output];
        }

        // check for each element in the output_list, the format is correctly adhered to
        for (let index = 0; index < (output as OutputElement[]).length; index++) {
          for (const key in output_format) {
            // unable to ensure accuracy of dynamic output header, so skip it
            if (/<.*?>/.test(key)) {
              continue;
            }

            // if output field missing, raise an error
            if (!(key in (output as OutputElement[])[index])) {
              throw new Error(`${key} not in json output`);
            }

            // check that one of the choices given for the list of words is an unknown
            if (Array.isArray(output_format[key])) {
              const choices = output_format[key] as string[];
              const field = (output as OutputElement[])[index][key];

              // ensure output is not a list
              if (Array.isArray(field)) {
                (output as OutputElement[])[index][key] = field[0];
              }
              // output the default category (if any) if Gemini is unable to identify the category
              if (
                typeof (output as OutputElement[])[index][key] === "string" &&
                !choices.includes((output as OutputElement[])[index][key] as string) &&
                default_category
              ) {
                (output as OutputElement[])[index][key] = default_category;
              }
              // if the output is a description format, get only the label
              if (
                typeof (output as OutputElement[])[index][key] === "string" &&
                ((output as OutputElement[])[index][key] as string).includes(":")
              ) {
                (output as OutputElement[])[index][key] = ((output as OutputElement[])[index][key] as string).split(":")[0];
              }
            }
          }

          // if we just want the values for the outputs
          if (output_value_only) {
            const values = Object.values((output as OutputElement[])[index]);
            (output as OutputElement[])[index] = values.length === 1 ? values[0] as OutputElement : (values as unknown as OutputElement);
          }
        }

        return list_input
          ? (output as { question: string; answer: string }[])
          : [output as { question: string; answer: string }];
      } catch (e) {
        error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
        // console.log("An exception occurred:", e);
        // console.log("Current invalid json format:", res);
      }
    } catch (e) {
      error_msg = `\n\nError message: ${e}`;
      // console.log("API call exception:", e);
    }
  }

  return [];
}