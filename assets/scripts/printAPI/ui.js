'use strict'
const store = require('../store.js')
const showPrintsTemplate = require('../templates/index-prints.handlebars')
const showPurchaseTemplate = require('../templates/index-purchases.handlebars')
const api = require('./api.js')
const getFormFields = require('../../../lib/get-form-fields')

const indexPrintsSuccess = (response) => {
  store.indexOfPrints = response
    const indexPrintsHtml = showPrintsTemplate({
      prints: response.prints
    })
    $('.orders').html(indexPrintsHtml)
    $('.remove-print-button').on('click', removePrint)
    $('.update-print-button').on('submit', updatePrint)
    calculateTotalCost()
  }

const calculateTotalCost = (response) => {
  const printArray = store.indexOfPrints.prints
  const totalQuantity = printArray.reduce(function (a, b) { return a + b.quantity }, 0)
  store.totalCost = totalQuantity * 100
  $('.total-cost-display').text('Subtotal is: $' + store.totalCost)
}

const indexPrintsFailure = (response) => {
  $('.cartHas-display').text(response)
}

const removePrint = (event) => {
  event.preventDefault()
  const findId = $(event.target).attr('data-id')
  api.removeById(findId)
    .then(removePrintSuccess(event.target))
    .then(() => {
      api.indexPrints()
        .then(indexPrintsSuccess)
        .catch(indexPrintsFailure)
    })
    .catch(removeprintFailure)
}

const updatePrint = (event) => {
  event.preventDefault()
  const findId = $(event.target).attr('data-id')
  const data = getFormFields(event.target)
  api.updateById(findId, data)
    .then(updatePrintSuccess)
    .then(() => {
      api.indexPrints()
        .then(indexPrintsSuccess)
        .catch(indexPrintsFailure)
    })
    .catch(updatePrintFailure)
}

const updatePrintSuccess = (response) => {
}

const updatePrintFailure = (response) => {
  $('.text-display').html('Error updating quantity')
}

const removePrintSuccess = (target) => {
  $('.create-print-message').detach()
  if ($('.create-print-failure').length) {
    $('.create-print-failure').detach()
  }
}
const removeprintFailure = (response) => {
  $('.text-display').html('Error removing print')
}

const showOrderSuccess = (data) => {
  if (data.orders.length === 0) {
    $('.purchase-display').html('You have no previously purchased prints')
  } else {
    const indexPurchaseHtml = showPurchaseTemplate({
      orders: data.orders
    })
    $('.purchase-display').html(indexPurchaseHtml)
  }
}

const showOrderFailure = (response) => {
  $('.purchase-display').text('no purchase history to display')
}

const createPrintSuccess = (target) => {
  if ($('.create-print-failure').length) {
    $('.create-print-failure').detach()
  }
  $('<div class="create-print-message"><p>Successfully added to cart!</p></div>').appendTo(target).fadeIn().delay(2000).fadeOut('slow')
  $('.purchaseConfirm').text('')
}

const createPrintFailure = (target) => {
  if ($('.create-print-message').length) {
    $('.create-print-message').detach()
  }
  $('<div class="create-print-failure"><p>Sorry, please choose a valid quantity.</p><div>').appendTo(target).fadeIn().delay(2000).fadeOut('slow')
  $('.purchaseConfirm').text('')
}

const alreadyInCart = (target) => {
  if ($('.create-print-message').length) {
    $('.create-print-message').detach()
  }
  $('<div class="create-print-failure"><p>Sorry, that print is already in the cart.</p><div>').appendTo(target).fadeIn().delay(2000).fadeOut('slow')
}

const tokenFailure = (response) => {
  $('.purchaseConfirm').text('unable to process purchase')
}

module.exports = {
  showOrderFailure,
  showOrderSuccess,
  tokenFailure,
  createPrintFailure,
  createPrintSuccess,
  alreadyInCart,
  indexPrintsFailure,
  indexPrintsSuccess,
  removePrint,
  calculateTotalCost
}
