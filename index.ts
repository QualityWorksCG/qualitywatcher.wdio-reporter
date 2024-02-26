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
      const testCaseDetails = {
        comment: test.error?.message ? test.error?.message?.replace(/\x1b\[[0-9;]*m/g, '') : test.title,
        status: test.state,
        time: test.duration || 0,
        attachments: [],
        suite_id: suite_id || undefined,
        test_id: test_id || undefined,
      };

      if (testCaseDetails.suite_id && testCaseDetails.test_id) {
        this.results.push(testCaseDetails);
      } else {
        const newCaseData = {
          case: {
            suiteTitle: test.parent,
            testCaseTitle: test.title,
            steps: ""
          },
          ...testCaseDetails
        }
        this.results.push(newCaseData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onSuiteEnd(suite) {
    try {
      this.checkDirectory(this.dir);
      fs.writeFileSync(
        this.dir + `/${suite.uid}[${this.generateRandomString()}].json`,
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

  generateRandomString() {
    return (Math.random() + 1).toString(36).substring(7);
  }
}
