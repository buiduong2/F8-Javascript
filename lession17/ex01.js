var distance = 0.5

var totalPrice = 0

var stage1 = 1
var stage2 = 5
var stage3 = 120

var priceStage1 = 15000
var priceStage2 = 13500
var priceStage3 = 11000

var overStageDiscount = 0.1

var currentStage = 1
var currentPriceStage = 15000

//Reach max Stage avaiable
while (distance > 0 && currentStage < 4) {
	var spaceBetweenStage = 0

	switch (currentStage) {
		case 1:
			spaceBetweenStage = stage1
			currentPriceStage = priceStage1
			break
		case 2:
			spaceBetweenStage = stage2 - stage1
			currentPriceStage = priceStage2
			break
		case 3:
			spaceBetweenStage = stage3 - stage2
			currentPriceStage = priceStage3
			break
		default:
			console.log('error')
			break
	}
	if (spaceBetweenStage <= distance) {
		distance -= spaceBetweenStage
		totalPrice += currentPriceStage * spaceBetweenStage
		currentStage++
	} else {
		break
	}
} 

var remainDistance = distance

if (currentStage === 1) {
	totalPrice = priceStage1
} else {
	totalPrice += currentPriceStage * remainDistance

	var isReachedFinalStage = currentStage >= 4 && remainDistance > 0
	if (isReachedFinalStage) {
		totalPrice = totalPrice - totalPrice * overStageDiscount
	}
}

console.log(totalPrice)
