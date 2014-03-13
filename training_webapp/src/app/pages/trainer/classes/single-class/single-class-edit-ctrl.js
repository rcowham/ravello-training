'use strict';


angular.module('trng.trainer.training.classes').controller('singleClassEditController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    '$dialogs',
    'trng.trainer.training.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.trainer.training.courses.CourseModel',
    'trng.common.utils.DateUtil',
    'currentClass',
    'courses',
    function ($scope, $rootScope, $state, $stateParams, $log, $window, $dialogs, classModel, classesService,
              courseModel, dateUtil, currentClass, courses) {

        $scope.init = function () {
            $scope.apps = [];

            $scope.initClass();
            $scope.initDates();
            $scope.initStudentsDataGrid();
        };

        $scope.initClass = function() {
            $scope.currentClass = currentClass;
            $scope.matchCourses();
        };

        $scope.matchCourses = function() {
            $scope.courses = courses;

            // The course reference inside the class should be a reference to the actual list of courses,
            // otherwise there might be problems rendering the view correctly.
            // Since the class is a copy of the originally loaded class, we know the reference is in fact
            // NOT a reference to the actual list of courses, so here the controller fixes that.
            $scope.currentClass.course = _.find($scope.courses, function(course) {
                return (course && course.hasOwnProperty('id') && course.id === $scope.currentClass.courseId);
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;
        };

        $scope.initStudentsColumns = function () {
            $scope.studentsColumns = [
                {
                    field: 'user.username',
                    displayName: 'User'
                },
                {
                    field: 'ravelloCredentials.username',
                    displayName: 'Ravello Email'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)">' +
                            '<i class="icon-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)">' +
                            '<i class="icon-trash" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initStudentsDataGrid = function () {
            $scope.selectedStudents = [];

            $scope.initStudentsColumns();
            $scope.studentsDataGrid = {
                data: 'currentClass.students',
                columnDefs: $scope.studentsColumns,
                selectedItems: $scope.selectedStudents,
                showSelectionCheckbox: false,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addStudent = function() {
            $state.go('^.single-student', {classId: $scope.currentClass.id});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go('^.single-student', {classId: $scope.currentClass.id, studentId: studentId});
        };

        $scope.deleteStudents = function() {
            var dialog = $dialogs.confirm("Delete students", "Are you sure you want to delete the students?");
            dialog.result.then(function(result) {
                classModel.deleteStudents($scope.currentClass, $scope.selectedStudents);
            });
        };

        $scope.deleteStudent = function(studentToDelete) {
            var dialog = $dialogs.confirm("Delete student", "Are you sure you want to delete the student?");
            dialog.result.then(function(result) {
                var studentId = studentToDelete.getProperty('id');
                classModel.deleteStudent($scope.currentClass, studentId);
            });
        };

        $scope.saveClass = function() {
            return classModel.save($scope.currentClass);
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addToEdit = function() {
            $state.go('^.edit-class');
        };

        $scope.init();
    }
]);


var singleClassEditResolver = {
    currentClass: ['$q', '$stateParams', 'trng.trainer.training.classes.ClassModel',
        function($q, $stateParams, classModel) {
            var classId = $stateParams['classId'];

            if (!classId) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return classModel.getClassById(classId).then(function(result) {
                return _.cloneDeep(result);
            });
        }
    ],

    courses: ['trng.trainer.training.courses.CourseModel',
        function(courseModel) {
            return courseModel.getAllCourses();
        }
    ]
};
