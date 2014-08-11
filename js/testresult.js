function TestResult(unitId, resultValue, testingProfile, rating) {
    this.testingProfile = testingProfile;
    this.testUnitDescription = unitId;
    this.resultValue = resultValue;
    this.runDate = "";
    this.setData = function (data) {
        for (var property in data) {
            this[property] = data[property];
        }
    };
};
TestResult.initHandlers = function(){
    $(document).on("click", ".removeTestingResult", function (event) {
        var testResultList = accessdb.session.get("testResultList");
        event.preventDefault();
        var testUnitId = $(event.target).attr("value");
        testResultList = _.filter(testResultList, function(item) {
            return item.testUnitDescription !== testUnitId;
        });
        accessdb.session.set("testResultList", testResultList);
    });
    $(document).on("click", "#testResultsPersist", function (event) {
        event.preventDefault();
        var tests_done = accessdb.session.get("testResultList").length;
        accessdb.session.tests_done = tests_done;//temp
        accessdb.session.saveResultsBunch(function(){
            accessdb.appRouter.redirect("tests-run-submit.html");
        });
    });

};
TestResult.viewTestingResultsBeforeSave = function () {
    var testResultList = accessdb.session.get("testResultList");
    if(testResultList && testResultList.length>0){
        var tmp = _.template($('#test-run-finish-resultsList').html(), {
            results: accessdb.session.get("testResultList")
        });
        $("#testingResultsDiv").empty();
        $("#testingResultsDiv").append(tmp);
    }
    else {
        $("#testingResultsDiv").html("<p>Currently found no test result data into your session.</p>");
    }
};
TestResult.isInLocalResults = function (unitid) {
    return  accessdb.session.testResultList.some(function (element, index, array) {
        return (element.testUnitId == unitid);
    });
};
TestResult.removeByUnitId = function (unitid) {
    var indx = -1;
    var filtered = accessdb.session.get("testResultList").filter(function (element, index, array) {
        if (element.testUnitId == unitid)
            indx = index;
        return (element.testUnitId == unitid);
    });
    if (indx > -1) {
        accessdb.session.get("testResultList").splice(indx, 1);
    }
};