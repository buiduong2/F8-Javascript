var distance = 50

var totalPrice = 0

var stage1 = 50
var stage2 = 100
var stage3 = 200
var stage4 = 300
var stage5 = 400

var priceStage1 = 1.678
var priceStage2 = 1.734
var priceStage3 = 2.014
var priceStage4 = 2.536
var priceStage5 = 2.834
var priceLastStage = 2.927

var currentStage = 1
var currentPriceStage = 1.678

while (distance > 0 && currentStage < 5) {
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
		case 4:
			spaceBetweenStage = stage4 - stage3
			currentPriceStage = priceStage4
			break
		case 5:
			spaceBetweenStage = stage5 - stage4
			currentPriceStage = priceStage5
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
		totalPrice += currentPriceStage * distance
		distance = 0
		break
	}
}

var remainDistance = distance

if (remainDistance > 0) {
	totalPrice += remainDistance * priceLastStage
}
console.log(totalPrice)
