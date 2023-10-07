// user customizable inputs:
var grade = 0;
// 0: Strongly Agree, 1: Agree, 2: Slightly Agree, 3: Strongly Disagree, 4: Slightly Disagree, 5: Disagree
var remark = "";
// remark for the academic
var autoSubmit = true;
// whether to submit the evaluation automatically or not

const idPrefix = "ContentPlaceHolderright_ContentPlaceHoldercontent_";
const numOfQuestions = 14;

for (var i = 0; i < 14; i++) {
	document
		.getElementById(`${idPrefix}objRptr_grade_${i}_${grade}_${i}`)
		.click();
}

document.getElementById(`${idPrefix}rmrk`).innerHTML = remark;
autoSubmit && document.getElementById(`${idPrefix}pstEvalBtn`).click();

console.log(
	`${
		document.getElementById(`${idPrefix}stfIdLst`).options[
			document.getElementById(`${idPrefix}stfIdLst`).selectedIndex
		].text || "Acadmic"
	} evaluated successfully.`
);
