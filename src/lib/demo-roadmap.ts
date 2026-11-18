import type { Roadmap } from "@/types/roadmap";

/**
 * Fixed sample data used by the landing page preview.
 * It is clearly labelled as illustrative and will also be reused for
 * the demo mode added in later phases.
 */
export const sampleRoadmap: Roadmap = {
  goal: "AI Engineer",
  level: "Beginner",
  weeklyHours: "14 hrs/week",
  duration: "24 weeks",
  topicCount: 20,
  completedTopicCount: 7,
  progress: 35,
  stages: [
    {
      id: "python-foundations",
      title: "Python Foundations",
      summary:
        "Build the programming base every AI workflow depends on: readable code, reusable functions, and the data structures you will meet in real projects.",
      duration: "3 weeks",
      difficulty: "Beginner",
      status: "completed",
      topics: [
        "Python syntax and control flow",
        "Functions, modules, and packages",
        "Object-oriented programming",
        "Lists, dictionaries, and sets",
      ],
      project: {
        title: "Student Grade Calculator",
        description:
          "Build a small command-line app that stores scores, calculates averages, and prints a clean report.",
      },
      prerequisites: ["No prerequisites — start here"],
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      summary:
        "Move from raw spreadsheets to inspected, cleaned, and visualised datasets using the standard Python data stack.",
      duration: "3 weeks",
      difficulty: "Beginner",
      status: "in-progress",
      topics: [
        "NumPy arrays and vectorised operations",
        "Pandas DataFrames and cleaning",
        "Matplotlib visualisation basics",
        "Exploratory data analysis workflow",
      ],
      project: {
        title: "Student Data Analysis",
        description:
          "Explore a public student-performance dataset and present three findings with supporting charts.",
      },
      prerequisites: ["Python Foundations"],
    },
    {
      id: "math-for-ai",
      title: "Mathematics for AI",
      summary:
        "Learn the linear algebra, probability, and statistics that make machine-learning behaviour easier to reason about.",
      duration: "4 weeks",
      difficulty: "Intermediate",
      status: "upcoming",
      topics: [
        "Vectors, matrices, and matrix operations",
        "Probability and distributions",
        "Descriptive and inferential statistics",
        "Derivatives and optimisation intuition",
      ],
      project: {
        title: "Data Visualisation Notebook",
        description:
          "Create a notebook that explains one dataset through distributions, correlations, and uncertainty.",
      },
      prerequisites: ["Data Analysis", "Basic mathematics"],
    },
    {
      id: "machine-learning",
      title: "Machine Learning",
      summary:
        "Build, compare, and evaluate supervised models while learning how to avoid the most common beginner mistakes.",
      duration: "6 weeks",
      difficulty: "Intermediate",
      status: "upcoming",
      topics: [
        "Regression and classification",
        "Train, validation, and test splits",
        "Model evaluation and metrics",
        "Scikit-learn pipelines",
      ],
      project: {
        title: "Student Performance Predictor",
        description:
          "Train a model that predicts student outcomes, then document the features, metrics, and limitations.",
      },
      prerequisites: ["Mathematics for AI"],
    },
    {
      id: "deep-learning",
      title: "Deep Learning",
      summary:
        "Understand how neural networks learn and train your first image model with a modern framework.",
      duration: "8 weeks",
      difficulty: "Advanced",
      status: "upcoming",
      topics: [
        "Neural network fundamentals",
        "TensorFlow or PyTorch basics",
        "Training loops and regularisation",
        "Experiment tracking and evaluation",
      ],
      project: {
        title: "Image Classification Demo",
        description:
          "Fine-tune an image classifier and deploy a small demo with a clear explanation of its accuracy.",
      },
      prerequisites: ["Machine Learning"],
    },
  ],
};
