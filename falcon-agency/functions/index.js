/* eslint-disable max-len */
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
  Suggestions,
  Carousel,
  Image,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');


// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const managementCarousel = () => {
  const carousel = new Carousel({
    items: {
      'Daniel': {
        title: 'Daniel Endres',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/daniel.jpg',
          alt: 'Daniel Endres',
        }),
      },
      'Max': {
        title: 'Max-F. Scheichenost',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/max.jpg',
          alt: 'Max-F. Scheichenost',
        }),
      },
      'Kelvin': {
        title: 'Kelvin Koo',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/kelvin.jpg',
          alt: 'Kelvin Koo',
        }),
      },
      'Soosan': {
        title: 'Soo San',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/soo%20san.jpg',
          alt: 'Soo San',
        }),
      },
    },
  });
  return carousel;
};

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  // eslint-disable-next-line max-len
  conv.ask(`Welcome! I can tell you about the agency, the number of employees or about the top management. Which would you like?`);
  conv.ask(new Suggestions(['About Agency', 'Top Management']));
});

app.intent('About Agency', (conv) => {
  conv.ask('Falcon Agency is fastest growing digital agency in South-East Asia.');
  conv.ask('What next?');
  conv.ask(new Suggestions(['Top Management', 'Number of employees']));
});

app.intent('Number of employees', (conv) => {
  conv.ask('We are team of 50.');
  conv.ask('Anything else?');
  conv.ask(new Suggestions(['Top Management', 'About Agency']));
});

app.intent('Top Management', (conv) => {
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  } else {
    conv.ask('These are our top management as follows:');
    conv.ask(managementCarousel());
  }
});

const SELECTED_ITEM_RESPONSES = {
  'Daniel': 'You selected the Daniel Endres',
  'Max': 'You selected the Max-F. Scheichenost',
  'Kelvin': 'Kelvin Koo',
  'Soosan': 'Soo San',
};

app.intent('actions.intent.OPTION', (conv, params, option) => {
  let response = 'You did not select any item';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  }
  conv.ask(response);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
