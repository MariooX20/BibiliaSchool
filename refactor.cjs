const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import Courses from './components/courses/Courses'",
  "import Courses from './components/courses/Courses'\nimport Lesson from './components/lesson/Lesson'\nimport Settings from './components/settings/Settings'"
);

// 2. Replace Lesson tab
const lessonStart = content.indexOf("{activeTab === 'lesson' && currentCourse && (");
const lessonEnd = content.indexOf("        )}\n\n        {/* TAB 5: SETTINGS */}");

if (lessonStart !== -1 && lessonEnd !== -1) {
  content = content.substring(0, lessonStart) + `{activeTab === 'lesson' && currentCourse && (
          <Lesson 
            currentCourse={currentCourse}
            currentLessonIndex={currentLessonIndex}
            setCurrentLessonIndex={setCurrentLessonIndex}
            setQuizSelection={setQuizSelection}
            setQuizChecked={setQuizChecked}
            themeMode={themeMode}
          />\n` + content.substring(lessonEnd);
} else {
  console.log("Failed to find lesson tab boundaries");
}

// 3. Replace Settings tab
const settingsStart = content.indexOf("{activeTab === 'settings' && (");
const settingsEnd = content.indexOf("        )}\n\n      </main>");

if (settingsStart !== -1 && settingsEnd !== -1) {
  content = content.substring(0, settingsStart) + `{activeTab === 'settings' && (
          <Settings 
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            handleResetProgress={handleResetProgress}
          />\n` + content.substring(settingsEnd);
} else {
  console.log("Failed to find settings tab boundaries");
}

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully refactored App.jsx');
