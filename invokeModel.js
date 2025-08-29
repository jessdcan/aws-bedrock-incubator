// This example demonstrates how to use the Amazon Nova foundation models to generate text.
// It shows how to:
// - Set up the Amazon Bedrock runtime client
// - Create a message
// - Configure and send a request
// - Process the response

import {
    BedrockRuntimeClient,
    ConversationRole,
    ConverseCommand,
  } from "@aws-sdk/client-bedrock-runtime";
  
import dotenv from 'dotenv';
dotenv.config();
  
  // Step 1: Create the Amazon Bedrock runtime client
  // Credentials will be automatically loaded from the environment.
  const client = new BedrockRuntimeClient({ 
    region: "eu-north-1" , 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
  });
  
  // Step 2: Specify which model to use:
  // Available Amazon Nova models and their characteristics:
  // - Amazon Nova Micro: Text-only model optimized for lowest latency and cost
  // - Amazon Nova Lite:  Fast, low-cost multimodal model for image, video, and text
  // - Amazon Nova Pro:   Advanced multimodal model balancing accuracy, speed, and cost
  //
  // For the most current model IDs, see:
  // https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
  const modelId = "eu.amazon.nova-pro-v1:0";
  
  // Step 3: Create the message
  // The message includes the text prompt and specifies that it comes from the user
  const inputText =
    "Describe the purpose of a 'hello world' program in one line.";
  const message = {
    content: [{ text: inputText }],
    role: ConversationRole.USER,
  };
  
  // Step 4: Configure the request
  // Optional parameters to control the model's response:
  // - maxTokens: maximum number of tokens to generate
  // - temperature: randomness (max: 1.0, default: 0.7)
  //   OR
  // - topP: diversity of word choice (max: 1.0, default: 0.9)
  // Note: Use either temperature OR topP, but not both
  const request = {
    modelId,
    messages: [message],
    inferenceConfig: {
      maxTokens: 500, // The maximum response length
      temperature: 0.5, // Using temperature for randomness control
      //topP: 0.9,        // Alternative: use topP instead of temperature
    },
  };
  
  // Step 5: Send and process the request
  // - Send the request to the model
  // - Extract and return the generated text from the response
  try {
    const response = await client.send(new ConverseCommand(request));
    console.log(response.output.message.content[0].text);
    console.log(response.metrics);
    console.log(response.usage);
  } catch (error) {
    console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${error.message}`);
    throw error;
  }
  