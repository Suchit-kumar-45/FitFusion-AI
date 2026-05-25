const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const generatePersonalizedWorkout = (userProfile) => {
  const { name, age, gender, weight, height, goal, level } = userProfile;
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  let intensity = "Moderate";
  let exercises = [];
  let genderNote = "";
  
  // Add gender-specific considerations
  if (gender === "Female") {
    genderNote = "\n**Gender-Specific Considerations:**\n- Focus on full-body compound movements\n- Include lower body emphasis for strength and tone\n- Expect slower but sustainable strength gains\n- Monitor hormonal cycles for recovery";
  } else if (gender === "Male") {
    genderNote = "\n**Gender-Specific Considerations:**\n- Take advantage of testosterone for strength gains\n- Focus on progressive overload\n- Expect faster muscle development\n- Maintain consistent recovery protocols";
  }
  
  if (level === "Beginner") {
    intensity = "Light to Moderate";
    exercises = [
      "Bodyweight squats - 3 sets x 10-12 reps",
      "Push-ups - 3 sets x 8-10 reps",
      "Dumbbell rows - 3 sets x 10-12 reps",
      "Walking lunges - 3 sets x 10 reps per leg",
      "Plank - 3 sets x 20-30 seconds"
    ];
  } else if (level === "Intermediate") {
    intensity = "Moderate";
    exercises = [
      "Barbell squats - 4 sets x 8-10 reps",
      "Bench press - 4 sets x 8-10 reps",
      "Bent-over rows - 4 sets x 8-10 reps",
      "Deadlifts - 3 sets x 5-6 reps",
      "Weighted dips - 3 sets x 8-10 reps"
    ];
  } else {
    intensity = "High";
    exercises = [
      "Heavy barbell squats - 5 sets x 3-5 reps",
      "Heavy bench press - 5 sets x 3-5 reps",
      "Deadlifts - 4 sets x 3-5 reps",
      "Weighted pull-ups - 4 sets x 5-8 reps",
      "Barbell rows - 4 sets x 5-8 reps"
    ];
  }

  let goalTips = "";
  if (goal === "Weight Loss") {
    goalTips = "Include 20-30 minutes of cardio after workouts. Maintain a calorie deficit for fat loss.";
  } else if (goal === "Muscle Gain") {
    goalTips = "Focus on progressive overload. Eat in a calorie surplus with high protein intake (2g per kg body weight).";
  } else if (goal === "Maintenance") {
    goalTips = "Maintain steady performance. Balance workout intensity with adequate recovery.";
  } else if (goal === "Endurance") {
    goalTips = "Include long-distance cardio 2-3x per week. Build aerobic capacity gradually.";
  }

  return `PERSONALIZED WORKOUT PLAN FOR ${name.toUpperCase()}

**User Profile:**
- Gender: ${gender}
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Goal: ${goal}
- Experience Level: ${level}
- Intensity: ${intensity}

**MONDAY - Upper Body Strength**
${exercises.slice(0, 2).map(e => `- ${e}`).join('\n')}
- Rest: 60-90 seconds between sets

**TUESDAY - Lower Body & Core**
${exercises.slice(2, 4).map(e => `- ${e}`).join('\n')}
- Rest: 90-120 seconds between sets

**WEDNESDAY - Rest or Light Cardio**
- 20-30 minutes light walking, swimming, or cycling

**THURSDAY - Full Body**
${exercises.slice(0, 3).map(e => `- ${e}`).join('\n')}
- Rest: 60 seconds between sets

**FRIDAY - Power & Explosiveness**
${exercises.map(e => `- ${e}`).join('\n')}

**SATURDAY - Cardio & Flexibility**
- 30-40 minutes moderate cardio
- 10 minutes stretching

**SUNDAY - Complete Rest**
- Focus on recovery and nutrition

**Special Notes for ${goal}:**
${goalTips}

**Nutrition Tips:**
- Protein: ${(weight * 1.6).toFixed(0)}-${(weight * 2.2).toFixed(0)}g per day
- Stay hydrated: Drink 3-4 liters of water daily
- Pre-workout: Light carbs + protein 1-2 hours before
- Post-workout: Protein + carbs within 30 minutes${genderNote}`;
};

const generatePersonalizedDiet = (userProfile) => {
  const { name, age, gender, weight, height, goal, calories = 2000 } = userProfile;
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  let breakfast = [];
  let lunch = [];
  let dinner = [];
  let genderNote = "";
  
  // Add gender-specific meal adjustments
  if (gender === "Female") {
    genderNote = "\n**Gender-Specific Nutrition Notes:**\n- Iron-rich foods recommended for menstruating individuals\n- Include adequate calcium and vitamin D\n- Adjust calories during different phases if applicable\n- May require slightly lower caloric intake than male counterparts";
  } else if (gender === "Male") {
    genderNote = "\n**Gender-Specific Nutrition Notes:**\n- Higher caloric needs due to greater muscle mass\n- Zinc-rich foods beneficial for hormonal health\n- Adequate protein crucial for testosterone production\n- May tolerate higher caloric surpluses for muscle gain";
  }
  
  if (goal === "Weight Loss") {
    breakfast = ["Egg white omelette (3 egg whites)", "Whole wheat toast (1 slice)", "Green tea"];
    lunch = ["Grilled chicken breast (150g)", "Brown rice (1 cup)", "Steamed broccoli (2 cups)"];
    dinner = ["Salmon (150g)", "Sweet potato (150g)", "Mixed salad"];
  } else if (goal === "Muscle Gain") {
    breakfast = ["3 whole eggs + 2 egg whites", "Oatmeal (1.5 cups)", "Banana with peanut butter"];
    lunch = ["Chicken breast (250g)", "White rice (2 cups)", "Olive oil"];
    dinner = ["Lean beef (250g)", "Sweet potato (200g)", "Broccoli"];
  } else {
    breakfast = ["2 whole eggs", "Whole grain toast (2 slices)", "Orange juice"];
    lunch = ["Grilled chicken (200g)", "Brown rice (1.5 cups)", "Vegetables"];
    dinner = ["Fish (200g)", "Pasta (1 cup)", "Salad"];
  }

  const proteinMultiplier = goal === "Muscle Gain" ? 2.0 : 1.6;
  const protein = (weight * proteinMultiplier).toFixed(0);

  return `PERSONALIZED DIET PLAN FOR ${name.toUpperCase()}

**User Profile:**
- Gender: ${gender}
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Goal: ${goal}
- Target Calories: ${calories} kcal/day

**DAILY MACRONUTRIENT TARGETS:**
- Protein: ${protein}g (${(protein * 4).toFixed(0)} kcal)
- Carbs: ${((calories * 0.5) / 4).toFixed(0)}g (${(calories * 0.5).toFixed(0)} kcal)
- Fats: ${((calories * 0.3) / 9).toFixed(0)}g (${(calories * 0.3).toFixed(0)} kcal)

**BREAKFAST (7:00 AM) - ~${(calories * 0.25).toFixed(0)} kcal**
${breakfast.map(item => `- ${item}`).join('\n')}

**MID-MORNING SNACK (10:00 AM) - ~150 kcal**
- Greek yogurt (150g) with berries
- Protein bar (optional)

**LUNCH (1:00 PM) - ~${(calories * 0.35).toFixed(0)} kcal**
${lunch.map(item => `- ${item}`).join('\n')}

**PRE-WORKOUT SNACK (4:00 PM) - ~150 kcal**
- Banana with almonds
- Or energy bar

**POST-WORKOUT (6:00 PM) - ~${(calories * 0.15).toFixed(0)} kcal**
- Whey protein shake (30g)
- Dextrose or banana

**DINNER (8:00 PM) - ~${(calories * 0.3).toFixed(0)} kcal**
${dinner.map(item => `- ${item}`).join('\n')}

**HYDRATION:**
- Minimum 3-4 liters of water daily
- Increase intake on workout days

**Tips for ${goal}:**
${goal === "Weight Loss" ? "- Eat whole foods, avoid processed items\n- Track calories closely\n- Include fiber for satiety" : goal === "Muscle Gain" ? "- Eat in a calorie surplus\n- Prioritize protein at every meal\n- Don't skip meals" : "- Maintain balanced nutrition\n- Consistent meal timing\n- Listen to your body"}

**Shopping List for Week:**
- Proteins: Chicken, fish, eggs, Greek yogurt
- Carbs: Rice, oats, sweet potatoes, whole wheat bread
- Vegetables: Broccoli, spinach, tomatoes, peppers
- Healthy fats: Olive oil, almonds, avocado${genderNote}`;
};

const generatePersonalizedAIResponse = (userProfile, message) => {
  const { name, age, gender, weight, height, goal } = userProfile;
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  // Simple logic to respond based on keywords and user profile
  const lowerMessage = message.toLowerCase();
  
  let response = `Hello ${name}! Based on your profile (Gender: ${gender}, Age: ${age}, Weight: ${weight}kg, Goal: ${goal}, BMI: ${bmi}), `;
  
  if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
    if (goal === "Weight Loss") {
      response += `I'd recommend focusing on high-intensity interval training combined with strength training. As a ${gender?.toLowerCase() || 'person'}, this helps burn calories efficiently while preserving muscle mass. Since your goal is weight loss, try doing 30-40 minutes of combined cardio and weights 4-5 times per week.`;
    } else if (goal === "Muscle Gain") {
      response += `you should focus on progressive overload with compound movements. Aim for 4-5 strength training sessions per week, allowing 48 hours between targeting the same muscle groups. Ensure you're eating in a calorie surplus to support muscle growth. As a ${gender?.toLowerCase() || 'person'}, leverage your natural advantages for strength development.`;
    } else {
      response += `consistent training 3-4 times per week is ideal for maintenance. Mix strength training and cardio to keep your fitness balanced and avoid plateaus. Your ${gender?.toLowerCase() || 'gender'} may help you maintain strength with proper training.`;
    }
  } else if (lowerMessage.includes("diet") || lowerMessage.includes("food") || lowerMessage.includes("nutrition")) {
    if (goal === "Weight Loss") {
      response += `you should focus on high-protein foods to maintain muscle while losing fat. Include lots of vegetables for fiber, and be mindful of portion sizes. Aim for a 500 calorie deficit from your maintenance level. As a ${gender?.toLowerCase() || 'person'}, ensure adequate iron and micronutrient intake.`;
    } else if (goal === "Muscle Gain") {
      response += `prioritize protein intake of at least ${(weight * 1.8).toFixed(0)}g daily. Eat in a calorie surplus of 300-500 calories above maintenance. Focus on whole foods and track your intake. As a ${gender?.toLowerCase() || 'person'}, consider gender-specific nutritional needs for optimal hormone balance.`;
    } else {
      response += `maintain a balanced diet with 40% carbs, 30% protein, and 30% fats. Consistency is key for maintaining your current fitness level. As a ${gender?.toLowerCase() || 'person'}, ensure all micronutrient needs are met.`;
    }
  } else if (lowerMessage.includes("weight") || lowerMessage.includes("bmi")) {
    response += `your current BMI is ${bmi}. ${bmi < 18.5 ? "You're underweight - focus on muscle gain." : bmi < 25 ? "You're in a healthy range - maintain with consistency." : "You might benefit from some weight management - focus on sustainable changes."} Your gender may influence your ideal weight range.`;
  } else {
    response += `here are some general tips for your goal (${goal}):\n- Stay consistent with your routine\n- Get 7-9 hours of quality sleep\n- Stay hydrated throughout the day\n- Consider working with a trainer for form checks\n- Track your progress to stay motivated\n- Remember that as a ${gender?.toLowerCase() || 'person'}, your fitness journey is unique to you.`;
  }
  
  return response;
};

const generateGeminiResponse =
  async (prompt) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("⚠️  Gemini API unavailable, using personalized fallback:", error.message);
      // Return a generic response - controllers will handle personalization
      throw error;
    }
  };

module.exports = {
  generateGeminiResponse,
  generatePersonalizedWorkout,
  generatePersonalizedDiet,
  generatePersonalizedAIResponse,
};