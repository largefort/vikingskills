const skills = [
    { name: 'Svǫð', xp: 0, level: 1 }, // Combat
    { name: 'Hǫggva', xp: 0, level: 1 }, // Swordsmanship
    { name: 'Skjǫldr', xp: 0, level: 1 }, // Shield Defense
    { name: 'Bǫrn', xp: 0, level: 1 }, // Archery
    { name: 'Bú', xp: 0, level: 1 }, // Farming
    { name: 'Fiska', xp: 0, level: 1 }, // Fishing
    { name: 'Tǫnn', xp: 0, level: 1 }, // Hunting
    { name: 'Handverk', xp: 0, level: 1 }, // Crafting
    { name: 'Sigla', xp: 0, level: 1 }, // Sailing
    { name: 'Nema', xp: 0, level: 1 }, // Learning
    { name: 'Trading', xp: 0, level: 1 },
    { name: 'Cooking', xp: 0, level: 1 },
    { name: 'Building', xp: 0, level: 1 },
    { name: 'Mining', xp: 0, level: 1 },
    { name: 'Woodcutting', xp: 0, level: 1 },
    { name: 'Smithing', xp: 0, level: 1 }
];

const xpPerTrain = 10;
const xpToNextLevel = (level) => level * 100;
let autoTrainInterval;

function saveGame() {
    localStorage.setItem('vikingSkills', JSON.stringify(skills));
}

function loadGame() {
    const savedSkills = JSON.parse(localStorage.getItem('vikingSkills'));
    if (savedSkills) {
        for (let i = 0; i < skills.length; i++) {
            skills[i].xp = savedSkills[i].xp;
            skills[i].level = savedSkills[i].level;
        }
    }
}

function createSkillElement(skill) {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill';

    const skillName = document.createElement('div');
    skillName.className = 'skill-name';
    skillName.textContent = skill.name;
    skillDiv.appendChild(skillName);

    const skillInfo = document.createElement('div');
    skillInfo.className = 'skill-info';
    skillInfo.textContent = `Level: ${skill.level} | XP: ${skill.xp}/${xpToNextLevel(skill.level)}`;
    skillDiv.appendChild(skillInfo);

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = (skill.xp / xpToNextLevel(skill.level) * 100) + '%';
    progressBarContainer.appendChild(progressBar);
    skillDiv.appendChild(progressBarContainer);

    const button = document.createElement('button');
    button.textContent = 'Train';
    button.addEventListener('click', () => {
        trainSkill(skill, progressBar, skillInfo);
        saveGame();
    });
    skillDiv.appendChild(button);

    return skillDiv;
}

function trainSkill(skill, progressBar, skillInfo) {
    skill.xp += xpPerTrain;
    const requiredXp = xpToNextLevel(skill.level);
    if (skill.xp >= requiredXp) {
        skill.level++;
        skill.xp -= requiredXp;
    }
    skillInfo.textContent = `Level: ${skill.level} | XP: ${skill.xp}/${xpToNextLevel(skill.level)}`;
    progressBar.style.width = (skill.xp / xpToNextLevel(skill.level) * 100) + '%';
}

function startAutoTrain() {
    autoTrainInterval = setInterval(() => {
        skills.forEach(skill => {
            const skillElements = document.querySelectorAll('.skill');
            skillElements.forEach(skillElement => {
                const skillName = skillElement.querySelector('.skill-name').textContent;
                if (skill.name === skillName) {
                    const progressBar = skillElement.querySelector('.progress-bar');
                    const skillInfo = skillElement.querySelector('.skill-info');
                    trainSkill(skill, progressBar, skillInfo);
                    saveGame();
                }
            });
        });
    }, 1000); // Train every second
}

function stopAutoTrain() {
    clearInterval(autoTrainInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    const skillsContainer = document.getElementById('skills');
    skills.forEach(skill => {
        skillsContainer.appendChild(createSkillElement(skill));
    });

    const autoTrainButton = document.getElementById('auto-train-button');
    let autoTrainActive = false;

    autoTrainButton.addEventListener('click', () => {
        if (autoTrainActive) {
            stopAutoTrain();
            autoTrainButton.textContent = 'Start Auto-Train';
        } else {
            startAutoTrain();
            autoTrainButton.textContent = 'Stop Auto-Train';
        }
        autoTrainActive = !autoTrainActive;
    });
});
