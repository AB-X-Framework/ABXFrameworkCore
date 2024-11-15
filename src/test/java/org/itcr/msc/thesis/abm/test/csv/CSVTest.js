const initialString = readString("{script}/data.csv");
const csvData = toCSV(initialString);
Assertions.assertEquals("a",csvData[0][0]);
Assertions.assertEquals("3",csvData[1][2]);
const finalString = csvToString(csvData);
Assertions.assertEquals(initialString.trim(),finalString.trim());