const WDIOReporter = require("@wdio/reporter").default;
const fs = require("fs");
const REGEX_SUITE_AND_TEST_ID = /\bS(\d+)C(\d+)\b/g;

export default class qwservice extends WDIOReporter {
  private _stateCounts = { passed: 0, failed: 0, skipped: 0, total: 0 };
  private results = [];
  private dir = "./QualityWatcher";

  constructor(options) {
    super(options);
    options = Object.assign(options, { stdout: true });
  }

  onTestPass() {
    this._stateCounts.passed++;
  }

  onTestFail() {
    this._stateCounts.failed++;
  }

  onTestSkip() {
    this._stateCounts.skipped++;
  }

  onTestEnd(test) {
    try {
      const { suite_id, test_id } = this.getSuiteAndCaseIds(test.title);
      if (suite_id && test_id) {
        let result = {
          suite_id,
          test_id,
          comment: test.error?.message || "",
          status: test.state,
          time: test.duration,
        };

        this.results.push(result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onSuiteEnd() {
    try {
      this.checkDirectory(this.dir);
      fs.writeFileSync(
        this.dir + `/Suite-${this.results[0].suite_id}[${this.generateRandomString()}].json`,
        JSON.stringify(this.results)
      );
    } catch (err) {
      console.error(err);
    }
  }

  getSuiteAndCaseIds(title) {
    let suiteAndCaseIds;
    let suiteId;
    let caseId;
    while ((suiteAndCaseIds = REGEX_SUITE_AND_TEST_ID.exec(title)) != null) {
      suiteId = suiteAndCaseIds[1];
      caseId = suiteAndCaseIds[2];
    }
    return {
      suite_id: Number(suiteId),
      test_id: Number(caseId),
    };
  }

  checkDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  generateRandomString(){
    return (Math.random() + 1).toString(36).substring(7);
  }
}
