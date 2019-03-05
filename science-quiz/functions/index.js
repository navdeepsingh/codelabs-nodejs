// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  Carousel,
  Image
} = require('actions-on-google');

const helpers = require('./helpers');
const config = require('./config');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});


let totalScore = 0;
let counter = 0;
let shuffleQuestions;

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
 const name = conv.user.storage.userName;
shuffleQuestions = [
  'Which gas is being filled in baloon?',
  'How many bones in human body?',
  'Evaporation process is fast in which temperature?',
  'Sea and ocean water cannot be used for drinking because it is?',
  'What is green pigment present in plants called?'
];
 if (!name) {
   // Asks the user's permission to know their name, for personalization.
   conv.ask(new Permission({
     context: 'This quiz will contain 5 questions. To get to know you better',
     permissions: 'NAME',
   }));
 } else {
   conv.ask(`Hi again, ${name}. This quiz will contain 5 questions. Best of Luck.`);
 }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {

  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no worries. Here's your first quiz question. ${shuffleQuestions[counter]}`);
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.data' object for the duration of the conversation.
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. Here's your first quiz question. ${shuffleQuestions[counter]}`);
  }
  counter++;
});

app.intent('answer_intent', (conv, {answer}) => {
  const name = conv.user.storage.userName;
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
	if (helpers.sanitize(answer) === 'hydrogen'
  || helpers.sanitize(answer) === '206'
  || helpers.sanitize(answer) === 'high'
  || helpers.sanitize(answer) === 'saline'
  || helpers.sanitize(answer) === 'chlorophyll'
  ) {
		totalScore = totalScore+20;
    if (counter === shuffleQuestions.length) { // Last question
      if (name) {
        conv.close(`<speak>Congratulations! ${name}, Your total score is ${totalScore} <audio src="${audioSound}"></audio></speak>`);
      } else {
        conv.close(`<speak>Congratulations!, Your total score is ${totalScore} <audio src="${audioSound}"></audio></speak>`);
      }
    } else {
      conv.ask(`Correct! Your total score is ${totalScore}. `);
  		conv.ask(`Next question. ${shuffleQuestions[counter]}`);
    }
    counter++;
	} else {
		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
    totalScore = 0;
    counter = 0;
	}
});

// app.intent('answer_1_intent', (conv, {answer}) => {
// 	if (helpers.sanitize(answer) === 'hydrogen') {
// 		totalScore = totalScore+20;
// 		conv.ask(`Correct! Your total score is ${totalScore}`);
// 		conv.ask(`Next question. ${shuffleQuestions[1]}`);
// 	} else {
// 		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
//     totalScore = 0;
// 	}
// });
//
// app.intent('answer_2_intent', (conv, {answer}) => {
// 	if (helpers.sanitize(answer) == 206) {
// 		totalScore = totalScore+20;
// 		conv.ask(`Correct! Your total score is ${totalScore}`);
// 		conv.ask(`Next question. Evaporation process is fast in which temperature?`);
// 		conv.ask(new Suggestions('High', 'Low'));
// 	} else {
// 		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
//     totalScore = 0;
// 	}
// });
//
// app.intent('answer_3_intent', (conv, {answer}) => {
// 	if (helpers.sanitize(answer) == 'high') {
// 		totalScore = totalScore+20;
// 		conv.ask(`Correct! Your total score is ${totalScore}`);
// 		conv.ask(`Next question. Sea and ocean water cannot be used for drinking because it is?`);
// 		conv.ask(new Suggestions('Saline', 'Sweet'));
// 	} else {
// 		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
// 		totalScore = 0;
// 	}
// });
//
// app.intent('answer_4_intent', (conv, {answer}) => {
// 	if (helpers.sanitize(answer) == 'saline') {
// 		totalScore = totalScore+20;
// 		conv.ask(`Correct! Your total score is ${totalScore}`);
// 		conv.ask(`Next question. What is green pigment present in plants called?`);
// 	} else {
// 		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
// 		totalScore = 0;
// 	}
// });
//
// app.intent('answer_5_intent', (conv, {answer}) => {
// 	const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
// 	const name = conv.user.storage.userName;
// 	if (helpers.sanitize(answer) == 'chlorophyll') {
// 		totalScore = totalScore+20;
// 		conv.ask(`Congratulations! Your total score is ${totalScore}`);
// 		if (name) {
// 		// If we collected user name previously, address them by name and use SSML
// 		// to embed an audio snippet in the response.
// 		conv.close(`<speak>Congratulations! ${name}, Your total score is ${totalScore} <audio src="${audioSound}"></audio>`);
// 		} else {
// 		conv.close(`<speak>Congratulations! Your total score is ${totalScore} <audio src="${audioSound}"></audio>`);
// 		}
// 	} else {
// 		totalScore = 0;
// 		conv.close(`Wrong Answer! Your total score is ${totalScore}`);
// 	}
// });

app.intent('actions_intent_NO_INPUT', (conv) => {
  // Use the number of reprompts to vary response
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Which color would you like to hear about?');
  } else if (repromptCount === 1) {
    conv.ask('Please say the name of a color.');
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's ` +
      `try this again later. Goodbye.`);
  }
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
