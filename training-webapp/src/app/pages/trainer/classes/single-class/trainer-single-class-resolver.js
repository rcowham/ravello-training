'use strict';

var singleClassResolver = {
    currentClass: [
        '$q', '$stateParams', 'ClassesService',
        function ($q, $stateParams, ClassesService) {
            var classId = $stateParams['classId'];

            if (!classId) {
                return $q.when({});
            }

            return ClassesService.getClassById(classId).then(
                function (theClass) {
					return _.cloneDeep(theClass);
                }
            );
        }
    ],

    courses: [
        'CoursesService',
        function (CoursesService) {
            return CoursesService.getAllCourses().then(
                function (courses) {
                    return _.cloneDeep(courses);
                }
            );
        }
    ]
};
