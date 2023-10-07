"use strict";

const idPrefix = "ContentPlaceHolderright_ContentPlaceHoldercontent_";
const numOfQuestions = 14;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function runEvaluateAcademic() {
	const rating = document.querySelector("input[name=rating]:checked")
		? document.querySelector("input[name=rating]:checked").value
		: 0;
	const comment = document.getElementById("comment")
		? document.getElementById("comment").value
		: "";
	const autoSubmit = document.getElementById("autosubmit-check")
		? document.getElementById("autosubmit-check").checked
		: false;

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const tabId = tabs[0].id;
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			function: (
				idPrefix,
				numOfQuestions,
				rating,
				comment,
				autoSubmit
			) => {
				if (document.getElementById(`${idPrefix}msgLbl`).innerHTML) {
					return;
				}
				for (var i = 0; i < numOfQuestions; i++) {
					document
						.getElementById(
							`${idPrefix}objRptr_grade_${i}_${rating}_${i}`
						)
						.click();
				}
				document.getElementById(`${idPrefix}rmrk`).innerHTML = comment;
				autoSubmit &&
					document.getElementById(`${idPrefix}pstEvalBtn`).click();

				console.log(
					`${
						document.getElementById(`${idPrefix}stfIdLst`).options[
							document.getElementById(`${idPrefix}stfIdLst`)
								.selectedIndex
						].text || "Acadmic"
					} evaluated successfully.`
				);
			},
			args: [idPrefix, numOfQuestions, rating, comment, autoSubmit],
		});
	});
}

function runEvaluateAcademics() {
	const rating = document.querySelector("input[name=rating]:checked")
		? document.querySelector("input[name=rating]:checked").value
		: 0;
	const comment = document.getElementById("comment")
		? document.getElementById("comment").value
		: "";

	chrome.runtime.sendMessage({
		action: "evaluate-all",
		rating: rating,
		comment: comment,
	});
}

document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("evaluate-single")
		.addEventListener("click", runEvaluateAcademic);

	document
		.getElementById("evaluate-all")
		.addEventListener("click", runEvaluateAcademics);
});
