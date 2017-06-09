var screen1_mock_json = require('./screen1_mock.js')
// vendor_suggested_retail => Vendor Suggested Retail = [egular Unit Retail - Total Retail Savings]
// regular_unit_retail => Regular Unit Retail
// total_retail_savings => Total Retail Savings
// total_vendor_funding_suggested => Total Vendor Funding Suggested
// oi_allowance_vendor => OI allowance from vendor
// sb_allowance_from_vendor => SB Allowance from vendor
// psp_funding_suggested => PSP Funding Suggested (POS)
// pet_depot_funding => Pet Depot Funding (Merchant Adjusted)
// total_psp_funding => Total PSP Funding - (POS + PET DEPOT)

const vendor_suggested_retail = 'vendor_suggested_retail'
const regular_unit_retail = 'regular_unit_retail'
const total_retail_savings = 'total_retail_savings'

const total_vendor_funding_suggested = 'total_vendor_funding_suggested'
const oi_allowance_vendor = 'oi_allowance_vendor'
const sb_allowance_from_vendor = 'sb_allowance_from_vendor'

const psp_funding_suggested = 'psp_funding_suggested'
const pet_depot_funding = 'pet_depot_funding'

const total_psp_funding = 'total_psp_funding'
let testPass = true

function screen1() {
  let myData = screen1_mock_json.result.data
  let priceJson = myData.price
  let costJson = myData.cost
  let basicFacts = myData.basic_facts
  for (let i = 1; i < priceJson.length; i++) {
    var item_id = basicFacts[i].itemId
    var total_retail_savings = priceJson[i].total_retail_savings

    let vendor_suggested_retail_expected = getExpectedVendorSuggestedRetail(costJson[i], priceJson[i])
    if ('$' + vendor_suggested_retail_expected !== priceJson[i].vendor_suggested_retail) {
      console.log('Failed in VendorSuggestedRetail at Item Id:', item_id)
      testPass = false
    }

    if (testPass) {
      let total_vendor_funding_suggested = testTotalVendorFundingSuggested(costJson[i], priceJson[i])
      let tvfsp = testTotalVendorFundingSuggestedPercentage(Number(total_vendor_funding_suggested), total_retail_savings)

      if ('$' + total_vendor_funding_suggested + ' (' + tvfsp + '%)' !== priceJson[i].total_vendor_funding_suggested) {
        console.log('Failed in testing testTotalVendorFundingSuggested at Item Id:', item_id)
        testPass = false
      }
    }

    if (testPass) {
      let psp_funding_suggested_expected = testPSPFundingSuggested(item_id, costJson[i], priceJson[i], testPass)
      let pfsp = testPSPFundingSuggestedPercentage(Number(psp_funding_suggested_expected), total_retail_savings)
      if ('$' + psp_funding_suggested_expected + ' (' + pfsp + '%)' !== priceJson[i].psp_funding_suggested) {
        console.log('Failed in testing of PSPFundingSuggested at Item Id:', item_id)
        testPass = false
      }
    }
  }
  if (testPass) {
    console.log('-----Congrats!!! Test succedded-----');
  }
}

function getExpectedVendorSuggestedRetail(costJson, priceJson) {
  var rur = priceJson.regular_unit_retail
  var trs = priceJson.total_retail_savings
  var regular_unit_retail = Number(rur.substr(1))
  var total_retail_savings = Number(trs.substr(1))
  return (regular_unit_retail - total_retail_savings)
}

function testTotalVendorFundingSuggested(costJson, priceJson) {
  var oi = costJson.oi_allowance_vendor
  var sb = priceJson.sb_allowance_from_vendor
  let total_vendor_funding_suggested = Number(oi.substr(1)) + Number(sb.substr(1))
  return total_vendor_funding_suggested.toFixed(2)
}

function testTotalVendorFundingSuggestedPercentage(total_vendor_funding_suggested, trs) {
  let value = total_vendor_funding_suggested / Number(trs.substr(1))
  value = value * 100
  return value.toFixed(2)
}

function testPSPFundingSuggested(item_id, costJson, priceJson) {
  // total_retail_savings
  var trs = priceJson.total_retail_savings
  var total_retail_savings = Number(trs.substr(1))

  // total_vendor_funding_suggested
  var oi = costJson.oi_allowance_vendor
  var sb = priceJson.sb_allowance_from_vendor
  let total_vendor_funding_suggested = Number(oi.substr(1)) + Number(sb.substr(1))

  // pet_depot_funding
  var pet_depot_funding = costJson.pet_depot_funding
  pet_depot_funding = Number(pet_depot_funding)

  var psp_funding_suggested_expected = total_retail_savings - total_vendor_funding_suggested - pet_depot_funding

  var total_psp_funding_expected = testTotalPspFunding(psp_funding_suggested_expected, pet_depot_funding)
  let pfsp = testPspFundingPercent(psp_funding_suggested_expected, costJson.pet_depot_funding, total_retail_savings)
  // console.log('$' + total_psp_funding_expected + ' (' + pfsp + '%)', priceJson.total_psp_funding)
  if ('$' + total_psp_funding_expected + ' (' + pfsp + '%)' !== priceJson.total_psp_funding) {
    console.log('Failed in testing of TotalPspFunding at Item Id:', item_id)
    testPass = false
  }
  return psp_funding_suggested_expected.toFixed(2)
}

function testPSPFundingSuggestedPercentage(psp_funding_suggested_expected, trs) {
  var value = psp_funding_suggested_expected / Number(trs.substr(1))
  value = value.toFixed(2)
  return value
}

function testTotalPspFunding(psp_funding_suggested, pet_depot_funding) {
  var value = psp_funding_suggested + pet_depot_funding
  value = value.toFixed(2)
  return value
}

function testPspFundingPercent(psp_funding_suggested_expected, pet_depot_funding, total_retail_savings) {
  let value = (Number(psp_funding_suggested_expected) - Number(pet_depot_funding)) / Number(total_retail_savings)
  value = value * 100
  return value.toFixed(2)
}

module.exports = {
  screen1
}
