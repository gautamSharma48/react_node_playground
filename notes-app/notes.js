import chalk from "chalk";
import fs from "fs";

export const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find((element) => element.title === title);
  debugger;
  if (duplicateNote) {
    console.log(chalk.red.inverse("Add Note failed"));
    return;
  }
  notes.push({ title, body });
  savedNotes(notes);
  console.log(chalk.green.inverse("Note is added"));
};

export const savedNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("./notes.json", dataJSON);
};

export const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("./notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (err) {
    return [];
  }
};

export const removeNote = (title) => {
  const notes = loadNotes();
  const removeNote = notes.filter((element) => element.title !== title);
  if (!(notes.length > removeNote.length)) {
    console.log(chalk.red.inverse("No Note Found!"));
    return;
  }
  savedNotes(removeNote);
  console.log(chalk.green.inverse("Remove Note", title));
};

export const readNote = (title) => {
  const notes = loadNotes();
  const getNote = notes.find((element) => element.title === title);
  if (!getNote) {
    console.log(chalk.red.inverse("No note found"));
    return
  }
  console.log(
    chalk.green.inverse("title: " + getNote?.title ? getNote?.title : ""),
    "Body: " + getNote?.body ? getNote?.body : ""
  );
};

export const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.inverse("Your notes"));
  notes.forEach((element) => console.log("title: " + element.title));
};