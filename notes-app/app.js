import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addNote, listNotes, readNote, removeNote } from "./notes.js";

// console.log(getNotes());
// const command = process.argv[2];
// if(command === "ADD"){
//     log(chalk.green.inverse("ADD"))
// }
// else if(command === "REMOVE"){
//     log(chalk.red.inverse("Remove"))
// }

// NPM - Modules - Done
// validator.js - valid email,name,phone all kind of input - done
// chalk - print colorful message in console - done
// command line arugment and file system -
// node does not provide arugement parsing so best way to manage we are using YARGS libray
//yargs-command line tool library for used for parsing arugment and generating an elegant user interface.
//hideBin is a shorthand for process.argv.slice(2)

const addNoteHandler = (argv) => {
  addNote(argv.title, argv.body);
};
const removeNoteHandler = (argv) => {
  removeNote(argv.title);
};
const listNoteHandler = () => {
  listNotes();
};

const readNoteHandler = (argv) => {
  readNote(argv.title);
};

yargs(hideBin(process.argv))
  .command(
    "add",
    "Add new note",
    (yargs) => {
      return yargs.options({
        body: {
          describe: "Note Description",
          demandOption: true,
          type: "string",
        },
        title: {
          describe: "Note Title",
          demandOption: true,
          type: "string",
        },
      });
    },
    addNoteHandler
  )
  .command(
    "remove",
    "Remove note",
    (yargs) => {
      return yargs.options({
        title: {
          demandOption: true,
          type: "string",
          describe: "Remove note",
        },
      });
    },
    removeNoteHandler
  )
  .command("list", "List note", (yargs) => {}, listNoteHandler)
  .command(
    "read",
    "Read note",
    (yargs) =>
      yargs.options({
        title: {
          demandOption: true,
          type: "string",
          describe: "Read Notes",
        },
      }),
    readNoteHandler
  )
  .parse();

