/**
 * This engine includes: 
 *    onOpen() - triggers prompt for permission to use checkboxes
 *    getPermi_() - blank, part of triggering permission
 * 
 *    shuffleArray(array) - shuffles the chosen vocab words
 *                          so that they are random each time
 * 
 *    generateNewVocabWords_(activeSheetName, vocabUnitID, part1or2) - 
 *                          updates the word list with the specified
 *                          Unit and Part based on the dropdown menues.
 *                          The words are listed in a randomized order.
 *    
 *    generateNewTranslationWords_(activeSheetName) - 
 *                          updates the word list with newly formed
 *                          verbs for translating.
 * 
 *    coverAnswers_(activeSheetName) - covers correct answers.
 * 
 *    revealAnswers_(activeSheetName) - reveals correct answers.
 * 
 *    clearStuff_(activeSheetName) - clears changing cells.
 * 
 *    onEdit(e) - runs proper function(s) depending on which
 *                box is checked.
 */


/**
 * A special function that runs when the spreadsheet is open, used to add a
 * custom menu to the spreadsheet.
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();

  var menuItems = [
    {name: 'Get Permission', functionName: 'getPermi_'}
  ];
  spreadsheet.addMenu('Get Permission!', menuItems);
}

/**
 * This function has been initially left blank.
 */
function getPermi_() {
  // blank
}

/**
 * Found online. Function to shuffle an array.
 * https://webapps.stackexchange.com/questions/79889/sort-randomly-in-a-google-script
 */
function shuffleArray(array) {
  var i, j, temp;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Generates new word list. 
 * Shuffles word list.
 * Displays words with answers in sheet.
 * 
 * Covers answers. 
 * Clears user input.
 * 
 * 
 * vocabUnitID is true unit number.
 * part1or2 is 1 for Part 1 and 2 for Part 2.
 */
function generateNewVocabWords_(activeSheetName, vocabUnitID, part1or2) {
  
  // Get current sheet 
  var spreadsheet = SpreadsheetApp.getActive();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);
  var vocabSheet = spreadsheet.getSheetByName('Vocab Word List');

  var wordList = [];

  var rowShift = 3 + (22 * (vocabUnitID - 1)); // was 17 before
  var columnShift = (3 * (part1or2 - 1));

  for (var i = 0; i < 20; i++) {  
    var tempWord = [1, 2];

    tempWord[0] = vocabSheet.getRange(i + rowShift, 2 + columnShift, 1, 1).getValue();
    tempWord[1] = vocabSheet.getRange(i + rowShift, 3 + columnShift, 1, 1).getValue();

    wordList.push(tempWord);
  }

  wordList = shuffleArray(wordList);

  for (var k = 0; k < 20; k++) {
    mainSheet.getRange(6 + k, 2, 1, 1).setValue(wordList[k][0]);
    mainSheet.getRange(6 + k, 4, 1, 1).setValue(wordList[k][1]);
  }

  coverVocabAnswers_(activeSheetName);

  mainSheet.getRange('C6:C25').clear();
  mainSheet.getRange('E6:E25').clear();
  mainSheet.getRange('F6').clear();
}

/**
 * Clears all 20 for vocab.
 */
function clearVocabStuff_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange('B6:E25').clear();
  mainSheet.getRange('F6').clear();
}

/**
 * Covers all 20 answers for vocab. 
 */
function coverVocabAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 20, 1).setBackground("black");
}

/**
 * Reveals (and grade) all 20 answers for vocab. 
 */
function revealVocabAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 20, 1).setBackground(null);

  var correctCounter = 0;

  for (var i = 0; i < 20; i++) {
    var theirAnswer = mainSheet.getRange(6 + i, 4, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(6 + i, 3, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("red");
    }
  }

  mainSheet.getRange('F6').setValue(correctCounter);
}

/**
 * Generates new verbs for Translation Practice. 
 */
function generateNewTranslationWords_(activeSheetName, desiredTense) {

  // Get current sheet 
  var spreadsheet = SpreadsheetApp.getActive();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);
  var verbSheet = spreadsheet.getSheetByName('Verbs List');
  var endingSheet = spreadsheet.getSheetByName('Endings List');

  var wordList = [];

  var numberOfVerbs = 113;
  var chantRange = 6; 
  var chantShift = 0;

  if (desiredTense == "any") {
    chantRange = 18;
  }

  if (desiredTense == "imperfect") {
    chantShift = 6;
  }
  else if (desiredTense == "future") {
    chantShift = 12;
  }

  for (var i = 0; i < 15; i++) {  
    var tempWord = [1, 2];

    var wordNumber = Math.floor(Math.random() * numberOfVerbs);

    var latinVerb = verbSheet.getRange(3 + wordNumber, 3, 1, 1).getValue();
    var latinMeaning = verbSheet.getRange(3 + wordNumber, 6, 1, 1).getValue();

    var chantNumber = (Math.floor(Math.random() * chantRange)) + chantShift;

    var ending = endingSheet.getRange(2 + chantNumber, 2, 1, 1).getValue();
    var personNumber = endingSheet.getRange(2 + chantNumber, 3, 1, 1).getValue();
    var tense = endingSheet.getRange(2 + chantNumber, 4, 1, 1).getValue();
    var pronounHelper = endingSheet.getRange(2 + chantNumber, 5, 1, 1).getValue();
    
    latinVerb = latinVerb.substring(0, latinVerb.length - 2);

    // check if 3rd conjugation
    if (wordNumber > 82 && wordNumber < 108) {
      latinVerb = latinVerb.substring(0, latinVerb.length - 1);
      // present
      if (chantNumber < 6) {
        if (chantNumber > 4) {
          latinVerb += "u";
        }
        else if (chantNumber > 0) {
          latinVerb += "i"
        }
      }
      else if (chantNumber > 11) {
        if (chantNumber < 13) {
          latinVerb += "a";
          ending = "m";
        }
        else {
          latinVerb += "e";
          ending = endingSheet.getRange(chantNumber - 10, 2, 1, 1).getValue();
        }
      }
      else {
        latinVerb += "e";
      }
    }
    // check if 4th conjugation
    else if (wordNumber > 107) {
      // present
      if (chantNumber == 5) {
        latinVerb += "u";
      }
      else if (chantNumber > 11) {
        if (chantNumber < 13) {
          latinVerb += "a";
          ending = "m";
        }
        else {
          latinVerb += "e";
          ending = endingSheet.getRange(chantNumber - 10, 2, 1, 1).getValue();
        }
      }
      else if (tense == "imperfect") {
        latinVerb += "e";
      }
    }
    // 1st/sg/present for 1st Conjugation
    else if (wordNumber < 59 && chantNumber == 0) {
      latinVerb = latinVerb.substring(0, latinVerb.length - 1);
    }

    // form verb if 1st/2nd conjugation
    latinVerb += ending;

    latinMeaning = latinMeaning.substring(3, latinMeaning.length);
    pronounHelper += " ";
    pronounHelper += latinMeaning;

    if (tense == "imperfect") {
      if (pronounHelper.charAt(pronounHelper.length - 1) == "e") {
        pronounHelper = pronounHelper.substring(0, pronounHelper.length - 1);
      }
      pronounHelper += "ing";
    }
    if (chantNumber == 2) {
      pronounHelper += "s";
    }

    // store verb with correct translation
    tempWord[0] = latinVerb;
    tempWord[1] = pronounHelper;

    wordList.push(tempWord);
  }

  for (var k = 0; k < 15; k++) {
    mainSheet.getRange(6 + k, 2, 1, 1).setValue(wordList[k][0]);
    mainSheet.getRange(6 + k, 4, 1, 1).setValue(wordList[k][1]);
  }

  coverAnswers_(activeSheetName);

  mainSheet.getRange('C6:C20').clear();
  mainSheet.getRange('E6:E20').clear();
  mainSheet.getRange('F6').clear();
}

/**
 * Generates new verbs for Translation Practice. 
 */
function generateNewParsingWords_(activeSheetName, desiredTense) {

  // Get current sheet 
  var spreadsheet = SpreadsheetApp.getActive();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);
  var verbSheet = spreadsheet.getSheetByName('Verbs List');
  var endingSheet = spreadsheet.getSheetByName('Endings List');

  var wordList = [];

  var numberOfVerbs = 113;
  var chantRange = 6; 
  var chantShift = 0;

  if (desiredTense == "any") {
    chantRange = 18;
  }

  if (desiredTense == "imperfect") {
    chantShift = 6;
  }
  else if (desiredTense == "future") {
    chantShift = 12;
  }

  for (var i = 0; i < 4; i++) {  
    var tempWord = [1, 2, 3, 4];

    var wordNumber = Math.floor(Math.random() * numberOfVerbs);

    var latinVerb = verbSheet.getRange(3 + wordNumber, 3, 1, 1).getValue();
    var latinMeaning = verbSheet.getRange(3 + wordNumber, 6, 1, 1).getValue();

    var chantNumber = (Math.floor(Math.random() * chantRange)) + chantShift;

    var ending = endingSheet.getRange(2 + chantNumber, 2, 1, 1).getValue();
    var personNumber = endingSheet.getRange(2 + chantNumber, 3, 1, 1).getValue();
    var tense = endingSheet.getRange(2 + chantNumber, 4, 1, 1).getValue();
    var pronounHelper = endingSheet.getRange(2 + chantNumber, 5, 1, 1).getValue();
    
    latinVerb = latinVerb.substring(0, latinVerb.length - 2);

    // check if 3rd conjugation
    if (wordNumber > 82 && wordNumber < 108) {
      latinVerb = latinVerb.substring(0, latinVerb.length - 1);
      // present
      if (chantNumber < 6) {
        if (chantNumber > 4) {
          latinVerb += "u";
        }
        else if (chantNumber > 0) {
          latinVerb += "i"
        }
      }
      else if (chantNumber > 11) {
        if (chantNumber < 13) {
          latinVerb += "a";
          ending = "m";
        }
        else {
          latinVerb += "e";
          ending = endingSheet.getRange(chantNumber - 10, 2, 1, 1).getValue();
        }
      }
      else {
        latinVerb += "e";
      }
    }
    // check if 4th conjugation
    else if (wordNumber > 107) {
      // present
      if (chantNumber == 5) {
        latinVerb += "u";
      }
      else if (chantNumber > 11) {
        if (chantNumber < 13) {
          latinVerb += "a";
          ending = "m";
        }
        else {
          latinVerb += "e";
          ending = endingSheet.getRange(chantNumber - 10, 2, 1, 1).getValue();
        }
      }
      else if (tense == "imperfect") {
        latinVerb += "e";
      }
    }
    // 1st/sg/present for 1st Conjugation
    else if (wordNumber < 59 && chantNumber == 0) {
      latinVerb = latinVerb.substring(0, latinVerb.length - 1);
    }

    // form verb if 1st/2nd conjugation
    latinVerb += ending;

    latinMeaning = latinMeaning.substring(3, latinMeaning.length);
    pronounHelper += " ";
    pronounHelper += latinMeaning;

    if (tense == "imperfect") {
      if (pronounHelper.charAt(pronounHelper.length - 1) == "e") {
        pronounHelper = pronounHelper.substring(0, pronounHelper.length - 1);
      }
      pronounHelper += "ing";
    }
    if (chantNumber == 2) {
      pronounHelper += "s";
    }

    // store verb with correct translation
    tempWord[0] = latinVerb;
    tempWord[1] = personNumber;
    tempWord[2] = tense;
    tempWord[3] = pronounHelper;

    wordList.push(tempWord);
  }

  for (var k = 0; k < 4; k++) {
    var rowOffset = 0;
    var columnOffset = 0;

    if (k > 1) {
      columnOffset = 5;
    }
    if (k == 1 || k == 3) {
      rowOffset = 5;
    }

    mainSheet.getRange(5 + rowOffset, 3 + columnOffset, 1, 1).setValue(wordList[k][0]);
    mainSheet.getRange(6 + rowOffset, 4 + columnOffset, 1, 1).setValue(wordList[k][1]);
    mainSheet.getRange(7 + rowOffset, 4 + columnOffset, 1, 1).setValue(wordList[k][2]);
    mainSheet.getRange(8 + rowOffset, 4 + columnOffset, 1, 1).setValue(wordList[k][3]);
  }

  coverParsingAnswers_(activeSheetName);

  mainSheet.getRange('C6:C8').clear();
  mainSheet.getRange('E6:E8').clear();
  mainSheet.getRange('C11:C13').clear();
  mainSheet.getRange('E11:E13').clear();
  mainSheet.getRange('H6:H8').clear();
  mainSheet.getRange('J6:J8').clear();
  mainSheet.getRange('H11:H13').clear();
  mainSheet.getRange('J11:J13').clear();
  mainSheet.getRange('G3').clear();
}

/**
 * Covers answers. 
 */
function coverAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 15, 1).setBackground("black");
}

/**
 * Covers answers. 
 */
function coverParsingAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 3, 1).setBackground("black");
  mainSheet.getRange(11, 4, 3, 1).setBackground("black");
  mainSheet.getRange(6, 9, 3, 1).setBackground("black");
  mainSheet.getRange(11, 9, 3, 1).setBackground("black");
}

/**
 * Reveals (and grade) answers. 
 */
function revealAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 15, 1).setBackground(null);

  var correctCounter = 0;

  for (var i = 0; i < 15; i++) {
    var theirAnswer = mainSheet.getRange(6 + i, 4, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(6 + i, 3, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("red");
    }
  }

  mainSheet.getRange('F6').setValue(correctCounter);
}

/**
 * Reveals (and grade) answers. 
 */
function revealParsingAnswers_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange(6, 4, 3, 1).setBackground(null);
  mainSheet.getRange(11, 4, 3, 1).setBackground(null);
  mainSheet.getRange(6, 9, 3, 1).setBackground(null);
  mainSheet.getRange(11, 9, 3, 1).setBackground(null);

  var correctCounter = 0;

  for (var i = 0; i < 3; i++) {
    var theirAnswer = mainSheet.getRange(6 + i, 3, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(6 + i, 4, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(6 + i, 5, 1, 1).setBackground("red");
    }
  }
  for (var i = 0; i < 3; i++) {
    var theirAnswer = mainSheet.getRange(11 + i, 3, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(11 + i, 4, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(11 + i, 5, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(11 + i, 5, 1, 1).setBackground("red");
    }
  }
  for (var i = 0; i < 3; i++) {
    var theirAnswer = mainSheet.getRange(6 + i, 8, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(6 + i, 9, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(6 + i, 10, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(6 + i, 10, 1, 1).setBackground("red");
    }
  }
  for (var i = 0; i < 3; i++) {
    var theirAnswer = mainSheet.getRange(11 + i, 8, 1, 1).getValue();
    var correctAnswer = mainSheet.getRange(11 + i, 9, 1, 1).getValue();

    if (theirAnswer == correctAnswer) {
      mainSheet.getRange(11 + i, 10, 1, 1).setBackground("green")

      correctCounter++;
    }
    else {
      mainSheet.getRange(11 + i, 10, 1, 1).setBackground("red");
    }
  }

  mainSheet.getRange('G3').setValue(correctCounter);
}

/**
 * Clears all.
 */
function clearStuff_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange('B6:E20').clear();
  mainSheet.getRange('F6').clear();
}

/**
 * Clears all.
 */
function clearParsingStuff_(activeSheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var mainSheet = spreadsheet.getSheetByName(activeSheetName);

  mainSheet.getRange('C5:E13').clear();
  mainSheet.getRange('H5:J13').clear();
  mainSheet.getRange('G3').clear();
}

/**
 * On edit function that allows input
 * for the checkboxes in OnBoard
 */
function onEdit(e) {
  const rg = e.range;

  var activeSheet = SpreadsheetApp.getActiveSheet();
  var sheetName = activeSheet.getName();

  if (sheetName == "Vocab Practice") {
    var unitNumber = activeSheet.getRange('B3').getValue();
    var partNumber = activeSheet.getRange('B4').getValue();

     // Check which box is checked
    if (rg.getA1Notation() === 'C3' && rg.isChecked()) {
      generateNewVocabWords_(sheetName, unitNumber, partNumber);
    
      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'D3' && rg.isChecked()) {
      revealVocabAnswers_(sheetName); 

      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'F3' && rg.isChecked()) {
      clearVocabStuff_(sheetName); 

      rg.uncheck();
    }
  }

  if (sheetName == "Translation Practice") {
    var tenseWanted = activeSheet.getRange('B3').getValue();

    if (rg.getA1Notation() === 'C3' && rg.isChecked()) {
      generateNewTranslationWords_(sheetName, tenseWanted);
    
      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'D3' && rg.isChecked()) {
      revealAnswers_(sheetName); 

      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'F3' && rg.isChecked()) {
      clearStuff_(sheetName); 

      rg.uncheck();
    }
  }

  if (sheetName == "Parsing Practice") {
    var tenseWanted = activeSheet.getRange('D3').getValue();

    if (rg.getA1Notation() === 'B3' && rg.isChecked()) {
      generateNewParsingWords_(sheetName, tenseWanted);
    
      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'C3' && rg.isChecked()) {
      revealParsingAnswers_(sheetName); 

      rg.uncheck();
    }
    else if (rg.getA1Notation() === 'I3' && rg.isChecked()) {
      clearParsingStuff_(sheetName); 

      rg.uncheck();
    }
  }
}
