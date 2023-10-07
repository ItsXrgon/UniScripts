const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

chrome.runtime.onMessage.addListener(function (message) {
	const idPrefix = "ContentPlaceHolderright_ContentPlaceHoldercontent_";
	const numOfQuestions = 14;

	chrome.storage.session.set({ deleting: true });
	chrome.storage.session.set({ index: 0 });
	chrome.storage.session.set({ rating: 0 });
	chrome.storage.session.set({ comment: "comment" });
	chrome.storage.session.set({ failCount: 0 });
	if (message.action === "evaluate-all") {
		runEvaluateAcademic(idPrefix, numOfQuestions);
	}
});

chrome.tabs.onUpdated.addListener(function (_, changeInfo, tab) {
	if (changeInfo.status === "complete" && tab) {
		chrome.storage.session.get(["deleting"]).then((deleting) => {
			if (!deleting) return;
			chrome.storage.session.get(["failCount"]).then((failCount) => {
				if (failCount > 2) {
					return;
				}
				chrome.storage.session.get(["index"]).then((index) => {
					chrome.storage.session.get(["rating"]).then((rating) => {
						chrome.storage.session
							.get(["comment"])
							.then((comment) => {
								runEvaluateAcademic(
									idPrefix,
									numOfQuestions,
									rating,
									comment
								);
							});
					});
				});
			});
		});
	}
});

function runEvaluateAcademic(idPrefix, numOfQuestions) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const tabId = tabs[0].id;
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			function: (idPrefix, numOfQuestions) => {
				if (
					document.getElementById(`${idPrefix}msgLbl`) &&
					document.getElementById(`${idPrefix}msgLbl`).innerHTML !==
						null
				) {
					return;
				}
				const rating = localStorage.getItem("rating");
				const comment = localStorage.getItem("comment");

				for (var i = 0; i < numOfQuestions; i++) {
					document
						.getElementById(
							`${idPrefix}objRptr_grade_${i}_${rating}_${i}`
						)
						.click();
				}
				document.getElementById(`${idPrefix}rmrk`).innerHTML = comment;
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
			args: [idPrefix, numOfQuestions],
		});
	});
}
