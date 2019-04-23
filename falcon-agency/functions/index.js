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
  BrowseCarousel,
  Image,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const managementCarousel = () => {
  const carousel = new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'DANIEL ENDRES',
        url: 'http://www.falcon-agency.com/about#management',
        description: 'Managing Partner',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/daniel.jpg',
          alt: 'DANIEL ENDRES',
        }),
        footer: 'Daniel is working closely with FALCON\'s clients, strategizing and finding solutions to complex challenges.',
      }),
      new BrowseCarouselItem({
        title: 'MAX-F. SCHEICHENOST',
        url: 'http://www.falcon-agency.com/about#management',
        description: 'Managing Partner',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/max.jpg',
          alt: 'MAX-F. SCHEICHENOST',
        }),
        footer: 'Max\'s primary role at the company involves working with FALCON\'s clients to improve their bottom-line results & marketing effectiveness. ​',
      }),
      new BrowseCarouselItem({
        title: 'KELVIN KOO',
        url: 'http://www.falcon-agency.com/about#management',
        description: 'Regional CEO (Asia)',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/kelvin.jpg',
          alt: 'KELVIN KOO',
        }),
        footer: 'Kelvin is responsible for the growth and management of the Singapore office, building a centre of excellence to serve FALCON’s clients in the region.',
      }),
      new BrowseCarouselItem({
        title: 'SOO SAN',
        url: 'http://www.falcon-agency.com/about#management',
        description: 'Finance Director',
        image: new Image({
          url: 'http://www.falcon-agency.com/user/themes/taita/img/team/soo%20san.jpg',
          alt: 'SOO SAN',
        }),
        footer: 'Soo San is responsible for financial decision-making that affects the group’s business and providing strategic financial input to senior management.',
      }),
    ],
  });
  return carousel;
};

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(`FALCON Agency is a full service digital agency serving clients in Southeast Asia. We are proud to work with industry leading brands and grow with them together.`);
  conv.ask(`Want to know about key persons in agency?`);
  if (conv.screen) return conv.ask(managementCarousel());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
