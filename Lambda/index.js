const Alexa = require('ask-sdk-core');

// ##################################################
// # インテントハンドラーの実装
// ##################################################

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'このスキルでは鉄、シリコンなどの元素名を話しかけると、その元素番号を答えます。何の元素番号を知りたいですか';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const  ElementNumIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ElementNumIntent';
  },
  handle(handlerInput) {
    const elementNumSlot = handlerInput.requestEnvelope.request.intent.slots.element;
    let speechText = '';
    if (!elementNumSlot.resolutions || elementNumSlot.resolutions.resolutionsPerAuthority[0].status.code !== 'ER_SUCCESS_MATCH') {
      speechText = `すみません、分かりませんでした。`;
    } else {
      const elementNumSlotValue     = elementNumSlot.value;
      const elementNumSlotValueName = elementNumSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      speechText = `${elementNumSlotValue} は ${elementNumSlotValueName} 番です。`;
    }
    speechText += `他に何の元素番号を知りたいですか`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = '元素名の元素番号を答えます。たとえば鉄、シリコンのように話しかけてください。何の元素番号を知りたいですか';
    const repromptText = 'たとえば、鉄、シリコンのように話しかけてください。';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = '元素名変換を終了します。またいつでも呼んでくださいね。';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const speechText = 'エラーが発生しました。';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

// ##################################################
// # スキルハンドラーの設定
// ##################################################

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ElementNumIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
