import { supabase } from '../lib/supabase';
import { Course, CourseWithProgress, CourseSection } from '../models/Course';

export class CourseService {
  // Get all published courses
  static async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('mdx_courses')
      .select(`
        *,
        course_categories(name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    return data.map(course => ({
      ...course,
      category: course.course_categories?.name
    }));
  }

  // Get course with user progress
  static async getCourseWithProgress(courseId: string): Promise<CourseWithProgress> {
    const { data, error } = await supabase.rpc('get_course_with_progress', {
      course_uuid: courseId
    });

    if (error) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }

  // Get MDX content from Supabase Storage
  static async getCourseContent(storagePath: string, fileName: string): Promise<string> {
    // Check if this is a test path (storage-samples)
    if (storagePath.startsWith('storage-samples/')) {
      // For testing, we'll return mock content based on the file
      return this.getMockContent(storagePath, fileName);
    }
    
    const filePath = `${storagePath}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('courses')
      .download(filePath);

    if (error) {
      throw new Error(`Failed to fetch course content: ${error.message}`);
    }

    return await data.text();
  }

  // Mock content for testing with storage-samples
  private static getMockContent(storagePath: string, fileName: string): Promise<string> {
    const mockContent: Record<string, string> = {
      'storage-samples/courses/intro-statistics/intro.mdx': `# What is Statistics?

Welcome to your first lesson in statistics! Statistics is the science of collecting, analyzing, interpreting, and presenting data. It's a powerful tool that helps us make sense of the world around us.

## Why Study Statistics?

Statistics is everywhere in our daily lives:

- **Business**: Companies use statistics to understand customer behavior and make strategic decisions
- **Healthcare**: Medical researchers use statistics to test new treatments and understand disease patterns
- **Sports**: Teams analyze player performance and game strategies using statistical methods
- **Government**: Policy makers rely on statistical data to make informed decisions

## Key Concepts

### Population vs Sample

- **Population**: The entire group you want to study
- **Sample**: A subset of the population that you actually observe

> **Example**: If you want to know the average height of all students in your university (population), you might measure the height of 100 randomly selected students (sample).

### Types of Data

1. **Quantitative Data**: Numerical data that can be measured
   - Height, weight, temperature, income
   
2. **Qualitative Data**: Categorical data that describes qualities
   - Gender, color, brand preference

### Descriptive vs Inferential Statistics

- **Descriptive Statistics**: Summarizing and describing data
- **Inferential Statistics**: Making predictions or inferences about a population based on sample data

## Getting Started

In the next sections, we'll dive deeper into:
- Measures of central tendency (mean, median, mode)
- Measures of variability (range, variance, standard deviation)
- Data visualization techniques
- Probability fundamentals

## Practice Exercise

Think about a question you'd like to answer using data. For example:
- "What's the average commute time for students at my school?"
- "Which social media platform is most popular among teenagers?"

Consider:
1. What is your population of interest?
2. How would you collect a representative sample?
3. What type of data would you need to collect?

---

**Next**: Continue to "Descriptive Statistics" to learn how to summarize and describe your data effectively.`,

      'storage-samples/courses/intro-statistics/descriptive-stats.mdx': `# Descriptive Statistics

Descriptive statistics help us summarize and understand our data through numerical measures and visualizations. Think of them as tools that give us a "snapshot" of what our data looks like.

## Measures of Central Tendency

These measures tell us where the "center" of our data lies.

### Mean (Average)
The sum of all values divided by the number of values.

**Formula**: μ = (Σx) / n

**Example**: Test scores: 85, 90, 78, 92, 88
Mean = (85 + 90 + 78 + 92 + 88) / 5 = 433 / 5 = 86.6

### Median
The middle value when data is arranged in order.

**Example**: 78, 85, **88**, 90, 92
Median = 88

### Mode
The most frequently occurring value.

**Example**: 85, 88, 90, 88, 92, 88
Mode = 88 (appears 3 times)

## Measures of Variability

These measures tell us how spread out our data is.

### Range
The difference between the highest and lowest values.

**Example**: Range = 92 - 78 = 14

### Variance
The average of the squared differences from the mean.

**Formula**: σ² = Σ(x - μ)² / n

### Standard Deviation
The square root of the variance. It tells us how much, on average, each data point differs from the mean.

**Formula**: σ = √(σ²)

> **Interpretation**: About 68% of data falls within 1 standard deviation of the mean in a normal distribution.

## Data Visualization

### Histograms
Show the distribution of numerical data by grouping values into bins.

### Box Plots
Display the five-number summary:
- Minimum
- First quartile (Q1)
- Median (Q2)
- Third quartile (Q3)
- Maximum

### Scatter Plots
Show the relationship between two numerical variables.

## Real-World Application

Let's say you're analyzing customer satisfaction scores (1-10) for a restaurant:

**Data**: 8, 9, 7, 10, 8, 6, 9, 8, 7, 9

**Analysis**:
- Mean = 8.1
- Median = 8
- Mode = 8 and 9 (bimodal)
- Range = 4
- Standard deviation ≈ 1.2

**Interpretation**: The restaurant has good customer satisfaction (mean > 8), with most scores clustering around 8-9, and relatively low variability.

## Key Takeaways

1. **Mean** is sensitive to outliers; **median** is more robust
2. **Standard deviation** helps us understand data spread
3. **Visualizations** make patterns easier to spot
4. Always consider the **context** when interpreting statistics

## Practice Problems

1. Calculate the mean, median, and mode for: 12, 15, 18, 15, 20, 22, 15
2. If a dataset has a mean of 50 and standard deviation of 10, what can you say about values between 40 and 60?
3. When would you prefer median over mean as a measure of central tendency?

---

**Next**: Learn about "Probability Basics" to understand uncertainty and randomness in data.`,

      'storage-samples/courses/ml-basics/intro.mdx': `# Introduction to Machine Learning

Welcome to the exciting world of Machine Learning! This course will take you from the fundamentals to practical applications of ML algorithms.

## What is Machine Learning?

Machine Learning is a subset of artificial intelligence (AI) that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.

### Traditional Programming vs Machine Learning

**Traditional Programming**:
\`\`\`
Data + Program → Output
\`\`\`

**Machine Learning**:
\`\`\`
Data + Output → Program (Model)
\`\`\`

## Types of Machine Learning

### 1. Supervised Learning
Learning with labeled examples (input-output pairs).

**Examples**:
- Email spam detection (emails labeled as spam/not spam)
- Image recognition (images labeled with objects)
- Price prediction (houses with known prices)

**Common Algorithms**:
- Linear Regression
- Decision Trees
- Random Forest
- Support Vector Machines
- Neural Networks

### 2. Unsupervised Learning
Finding patterns in data without labeled examples.

**Examples**:
- Customer segmentation
- Anomaly detection
- Data compression
- Recommendation systems

**Common Algorithms**:
- K-Means Clustering
- Hierarchical Clustering
- Principal Component Analysis (PCA)
- Association Rules

### 3. Reinforcement Learning
Learning through interaction with an environment using rewards and penalties.

**Examples**:
- Game playing (Chess, Go)
- Autonomous vehicles
- Trading algorithms
- Robotics

## The Machine Learning Workflow

1. **Problem Definition**: What are you trying to solve?
2. **Data Collection**: Gather relevant data
3. **Data Preprocessing**: Clean and prepare data
4. **Feature Engineering**: Select/create relevant features
5. **Model Selection**: Choose appropriate algorithm
6. **Training**: Teach the model using training data
7. **Evaluation**: Test model performance
8. **Deployment**: Put model into production
9. **Monitoring**: Track performance over time

## Key Terminology

- **Algorithm**: The method used to find patterns
- **Model**: The output of an algorithm trained on data
- **Features**: Input variables used to make predictions
- **Target**: The output variable you're trying to predict
- **Training Data**: Data used to train the model
- **Test Data**: Data used to evaluate model performance

## Real-World Applications

### Healthcare
- Medical image analysis
- Drug discovery
- Personalized treatment plans
- Epidemic prediction

### Finance
- Fraud detection
- Algorithmic trading
- Credit scoring
- Risk assessment

### Technology
- Search engines
- Recommendation systems
- Voice assistants
- Computer vision

### Transportation
- Route optimization
- Autonomous vehicles
- Traffic management
- Predictive maintenance

## Prerequisites for Success

1. **Mathematics**: Basic statistics, linear algebra, calculus
2. **Programming**: Python or R
3. **Domain Knowledge**: Understanding of the problem area
4. **Critical Thinking**: Ability to interpret results

## Common Challenges

- **Data Quality**: Incomplete, biased, or noisy data
- **Overfitting**: Model performs well on training data but poorly on new data
- **Underfitting**: Model is too simple to capture patterns
- **Interpretability**: Understanding why a model makes certain predictions
- **Scalability**: Handling large datasets efficiently

## Getting Started

In this course, you'll learn:
- How to prepare data for machine learning
- Different types of algorithms and when to use them
- How to evaluate and improve model performance
- Best practices for real-world applications

## Your First ML Project

Think about a problem you'd like to solve:
- Do you have data available?
- What type of ML problem is it (supervised/unsupervised)?
- What would success look like?

---

**Next**: Dive into "Supervised Learning" to understand how machines learn from examples.`,

      'storage-samples/courses/advanced-data-analysis/advanced-stats.mdx': `# Advanced Statistical Methods

Welcome to advanced statistical analysis! This section covers sophisticated techniques used in modern data science and research.

## Multivariate Analysis

When dealing with multiple variables simultaneously, we need advanced techniques to understand relationships and patterns.

### Multiple Linear Regression

Extends simple linear regression to multiple predictors:

**Model**: y = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ + ε

**Key Concepts**:
- **Adjusted R²**: Accounts for the number of predictors
- **Multicollinearity**: When predictors are highly correlated
- **Variable Selection**: Choosing the best subset of predictors

### Principal Component Analysis (PCA)

Reduces dimensionality while preserving variance:

**Applications**:
- Data visualization
- Noise reduction
- Feature extraction
- Compression

**Steps**:
1. Standardize the data
2. Compute covariance matrix
3. Find eigenvalues and eigenvectors
4. Select principal components
5. Transform the data

## Advanced Hypothesis Testing

### ANOVA (Analysis of Variance)

Compares means across multiple groups:

**One-Way ANOVA**: Tests if group means are equal
- H₀: μ₁ = μ₂ = ... = μₖ
- H₁: At least one mean is different

**Two-Way ANOVA**: Tests effects of two factors
- Main effects
- Interaction effects

### Non-Parametric Tests

When data doesn't meet parametric assumptions:

**Mann-Whitney U Test**: Non-parametric alternative to t-test
**Kruskal-Wallis Test**: Non-parametric alternative to ANOVA
**Chi-Square Test**: Tests independence of categorical variables

## Regression Diagnostics

### Assumptions of Linear Regression

1. **Linearity**: Relationship between X and Y is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of residuals
4. **Normality**: Residuals are normally distributed

### Diagnostic Plots

**Residual Plots**: Check for patterns in residuals
**Q-Q Plots**: Assess normality of residuals
**Leverage Plots**: Identify influential observations
**Cook's Distance**: Measure influence of individual points

## Advanced Modeling Techniques

### Logistic Regression

For binary outcomes:

**Model**: log(p/(1-p)) = β₀ + β₁x₁ + ... + βₚxₚ

**Interpretation**:
- Odds ratios
- Predicted probabilities
- Classification accuracy

### Poisson Regression

For count data:

**Model**: log(λ) = β₀ + β₁x₁ + ... + βₚxₚ

**Applications**:
- Number of events in a time period
- Rare disease occurrences
- Website clicks

### Survival Analysis

Analyzes time-to-event data:

**Kaplan-Meier Estimator**: Non-parametric survival curves
**Cox Proportional Hazards**: Semi-parametric regression
**Log-Rank Test**: Compares survival curves

## Regularization Techniques

### Ridge Regression (L2)

  // Mark section as completed
  static async completeSection(sectionId: string, timeSpent: number = 0): Promise<void> {
    const { data, error } = await supabase.rpc('complete_section', {
      section_uuid: sectionId,
      time_spent_seconds: timeSpent
    });

    if (error) {
      throw new Error(\`Failed to complete section: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to complete section');
    }
  }

  // Get user's course progress
  static async getUserCourseProgress(courseId: string) {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to fetch progress: ${error.message}`);
    }

    return data;
  }

  // Start course (create initial progress record)
  static async startCourse(courseId: string): Promise<void> {
    const { error } = await supabase
      .from('user_course_progress')
      .insert({
        course_id: courseId,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error && error.code !== '23505') { // 23505 is unique constraint violation
      throw new Error(`Failed to start course: ${error.message}`);
    }
  }

  // Get user's enrolled courses
  static async getUserCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        mdx_courses(
          *,
          course_categories(name)
        )
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user courses: ${error.message}`);
    }

    return data.map(item => ({
      ...item.mdx_courses,
      category: item.mdx_courses.course_categories?.name,
      progress: {
        completed_sections: item.completed_sections,
        progress_percentage: item.progress_percentage,
        last_accessed_at: item.last_accessed_at,
        started_at: item.started_at,
        completed_at: item.completed_at
      }
    }));
  }

  // Search courses
  static async searchCourses(query: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('mdx_courses')
      .select(`
        *,
        course_categories(name)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search courses: ${error.message}`);
    }

    return data.map(course => ({
      ...course,
      category: course.course_categories?.name
    }));
  }
}
    }
  }
}