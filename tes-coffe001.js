// test-coffee-module --coverage --debug

// npm install test-coffee-module --save

fixture`Pizza Palace`
  .page`https://testcase-demo-page.glitch.me`;

test('Submit a form', async t => {
  await t
    // automatically dismiss dialog boxes
    .setNativeDialogHandler(() => true)

    // drag the pizza size slider
    .drag('.noUi-handle', 100, 0)

    // select the toppings
    .click('.next-step')
    .click('label[for="pepperoni"]')
    .click('#step2 .next-step')

    // fill the address form
    .click('.confirm-address')
    .typeText('#phone-input', '+1-541-754-3001')
    .click('#step3 .next-step')

    // zoom into the iframe map
    .switchToIframe('.restaurant-location iframe')
    .click('button[title="Zoom in"]')

    // submit the order
    .switchToMainWindow()
    .click('.complete-order');
});

import { Selector } from 'testcafe';

fixture `Getting Started`
  .page `http://devexpress.github.io/testcafe/example`;

test('My first test', async t => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText).eq('Thank you, John Smith');

    const articleHeader = await Selector('.result-content').find('h1');

    // Obtain the tet of the article header
    let headerText = await articleHeader.innerText;

    // Use the assertion the check if the actual header text is equal to the expected one
});

// TESTING THE DOM
// Fixture.page Method
fixture `MyFixture`
  .page `http://devexpress.github.io/testcafe/example`;

test('Test1', async t => {
  // Starts at http://devexpress.github.io/testcafe/example
})


import { Selector } from 'testcafe';

const article = Selector('#article-content');

const checkbox = Selector('#testing-on-remote-devices');

fixture `My fixture`
  .page `http://www.example.com`;

test('Click a chek box and check its state', async t => {
  await t
    .click(checkbox)
    .expec(checkbox.checked).ok()
});

fixture `My fixture`
  .page `http://www.example.com`

test('Uploading', async t => {
  await t 
    .setFilesToUpload('#upload-input', [
      './uploads/1.jpg',
      './uploads/2.jpg',
      './uploads/3.jpg'
    ])
    .click('#upload-button');
});

// SELECT TARGET ELEMENTS
test('My Test', async t => {
  // Click will be performed on the first element
  // that matches the CSS selector
  await t.click('#submit-button')
});

import { Selector } from 'testcafe';

fixture `My fixture`
  .page `http://www.example.com`

cont lastItem = Selector('.toc-item:last-child');

test('My Test', async t => {
  // Click will be performed ont he elemnt selected by 
  // the 'getLastItem' selector.
  await t.click(lastItem);
});

// A client-side function that returns a DOM element
test('My Test', async t => {
  await t.click(() => document.body.children[2]);
})
