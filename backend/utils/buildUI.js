import fs from "fs";

const buildDir = "../ui/build";
const uiDir = "../ui";
const cssFileName = "style.css";
// step 1
const remakeBuildFolder = () => {
	// remove folder recursively
	try {
		fs.rmSync(buildDir, { recursive: true });
		console.log(`UI build directory ${buildDir} is deleted!`);
	} catch (err) {
		console.error(err);
		console.error(`Error while deleting UI build directory ${buildDir}.`);
	}
	// then make folder
	try {
		fs.mkdirSync(buildDir);
		console.log(`UI Build directory ${buildDir} is created`);
	} catch (err) {
		console.error(err);
		console.error(`Error creating UI build directory ${buildDir}`);
	}
};

// step 2
const copyCSStoBuild = () => {
	fs.copyFileSync(`${uiDir}/${cssFileName}`, `${buildDir}/${cssFileName}`);
};

export default function buildUI() {
	remakeBuildFolder();
	copyCSStoBuild();
}
