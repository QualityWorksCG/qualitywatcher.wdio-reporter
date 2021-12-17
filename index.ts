const WDIOReporter = require('@wdio/reporter').default
const fs = require('fs')

export default class qwservice extends WDIOReporter {
    private _stateCounts = { passed: 0, failed: 0, skipped: 0, total: 0 }
    private results = []
    private dir = './QualityWatcher'

    constructor(options) {
        super(options)
        options = Object.assign(options, { stdout: true })

    }

    onTestPass() {
        this._stateCounts.passed++
    }

    onTestFail() {
        this._stateCounts.failed++
    }

    onTestSkip() {
        this._stateCounts.skipped++
    }

    onTestEnd(test) {
        let result = {
            suite_id: this.getSuiteId(test.title),
            test_id: this.getTestId(test.title),
            comment: test.title,
            status: test.state,
            time: test.duration
        }

        this.results.push(result)
    }

    onSuiteEnd() {
        try {
            this.checkDirectory(this.dir)
            fs.writeFileSync(this.dir + `/suite-${this.results[0].suite_id}.json`, JSON.stringify(this.results))
        } catch (err) {
            console.error(err)
        }
    }

    getTestId(testName) {
        let caseRegex = /(?<=C)\d*?(?=])/ig
        return parseInt(testName.match(caseRegex))
    }

    getSuiteId(testName) {
        let suiteRegex = /(?<=S)\d*?(?=C)/ig
        return parseInt(testName.match(suiteRegex))
    }

    checkDirectory(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
