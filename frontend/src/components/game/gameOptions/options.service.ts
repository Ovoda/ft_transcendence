export async function showScoreOptions() {
	var x = document.getElementById("scoreOptions");
	console.log("Click on score");
	if (x) {
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
}

export async function showSizeOptions() {
	console.log("Click on size");
	var x = document.getElementById("sizeOptions");
	if (x) {
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
}

export async function showSpeedOptions() {
	var x = document.getElementById("speedOptions");
	if (x) {
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
}

export async function showColorOptions() {
	var x = document.getElementById("colorOptions");
	if (x) {
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
} 
