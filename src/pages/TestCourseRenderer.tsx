import React, { useState } from 'react';
import { ArrowLeft, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseRenderer from '../components/course/CourseRenderer';
import { CourseSection } from '../models/Course';

const TestCourseRenderer: React.FC = () => {
  const navigate = useNavigate();
  const [testMode, setTestMode] = useState<'mock' | 'storage'>('mock');
  const [selectedSample, setSelectedSample] = useState<string>('intro-statistics');
  const [selectedSection, setSelectedSection] = useState<string>('intro.mdx');

  // Sample course sections based on storage-samples
  const sampleSections: Record<string, CourseSection[]> = {
    'intro-statistics': [
      {
        id: 'section-1',
        course_id: 'test-course',
        title: 'What is Statistics?',
        file_name: 'intro.mdx',
        order_index: 1,
        estimated_duration: '20 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      },
      {
        id: 'section-2',
        course_id: 'test-course',
        title: 'Descriptive Statistics',
        file_name: 'descriptive-stats.mdx',
        order_index: 2,
        estimated_duration: '25 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ],
    'ml-basics': [
      {
        id: 'section-3',
        course_id: 'test-course-2',
        title: 'Introduction to Machine Learning',
        file_name: 'intro.mdx',
        order_index: 1,
        estimated_duration: '25 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ],
    'advanced-data-analysis': [
      {
        id: 'section-4',
        course_id: 'test-course-3',
        title: 'Advanced Statistical Methods',
        file_name: 'advanced-stats.mdx',
        order_index: 1,
        estimated_duration: '35 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ]
  };

  // Mock MDX content for testing
  const mockContent: Record<string, string> = {
    'intro-statistics/intro.mdx': `# What is Statistics?

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

    'intro-statistics/descriptive-stats.mdx': `# Descriptive Statistics

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

    'ml-basics/intro.mdx': `# Introduction to Machine Learning

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

    'advanced-data-analysis/advanced-stats.mdx': `# Advanced Statistical Methods

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

Adds penalty term: λΣβᵢ²

**Benefits**:
- Reduces overfitting
- Handles multicollinearity
- Shrinks coefficients toward zero

### Lasso Regression (L1)

Adds penalty term: λΣ|βᵢ|

**Benefits**:
- Feature selection
- Sparse solutions
- Automatic variable selection

### Elastic Net

Combines Ridge and Lasso:
- α controls mix of L1 and L2 penalties
- Balances feature selection and grouping

## Model Selection and Validation

### Cross-Validation

**k-Fold CV**: Divide data into k folds
**Leave-One-Out CV**: Special case where k = n
**Stratified CV**: Maintains class proportions

### Information Criteria

**AIC (Akaike Information Criterion)**:
AIC = 2k - 2ln(L)

**BIC (Bayesian Information Criterion)**:
BIC = k·ln(n) - 2ln(L)

Lower values indicate better models.

## Practical Example: Customer Churn Analysis

\`\`\`python
# Logistic regression for churn prediction
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load and prepare data
data = pd.read_csv('customer_data.csv')
X = data[['tenure', 'monthly_charges', 'total_charges']]
y = data['churn']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Fit model
model = LogisticRegression()
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))
\`\`\`

## Key Takeaways

1. **Choose appropriate methods** based on data type and research questions
2. **Check assumptions** before applying statistical tests
3. **Use regularization** to prevent overfitting
4. **Validate models** using proper techniques
5. **Interpret results** in context of the problem

## Advanced Topics to Explore

- Mixed-effects models
- Structural equation modeling
- Machine learning integration
- Causal inference methods
- Robust statistical methods

---

**Next**: Continue to "Time Series Analysis" to learn about analyzing temporal data patterns.`
  };

  const currentSection = sampleSections[selectedSample]?.find(
    section => section.file_name === selectedSection
  );

  const handleSectionComplete = (sectionId: string, timeSpent: number) => {
    console.log(`Section ${sectionId} completed in ${timeSpent} seconds`);
    alert(`Section completed! Time spent: ${Math.floor(timeSpent / 60)} minutes`);
  };

  // Mock CourseRenderer component for testing
  const MockCourseRenderer: React.FC<{ section: CourseSection; content: string }> = ({ section, content }) => {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
      setIsCompleting(true);
      // Simulate API call delay
      setTimeout(() => {
        setIsCompleting(false);
        handleSectionComplete(section.id, 120); // 2 minutes mock time
      }, 1000);
    };

    return (
      <div className="max-w-none">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-100 dark:bg-blue-900/30">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {section.order_index}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h1>
              {section.estimated_duration && (
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{section.estimated_duration}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </>
            )}
          </button>
        </div>

        {/* Course Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CourseRenderer Test
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Testing MDX content rendering and functionality
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Mode Selection */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Mode
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setTestMode('mock')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                testMode === 'mock'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Mock Data (Recommended)
            </button>
            <button
              onClick={() => setTestMode('storage')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                testMode === 'storage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Supabase Storage
            </button>
          </div>
          
          {testMode === 'storage' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Storage Mode Requires Setup
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    To test with Supabase Storage, you need to upload the MDX files from storage-samples to your Supabase Storage bucket named 'courses'.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Sample Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Sample Course
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course
                  </label>
                  <select
                    value={selectedSample}
                    onChange={(e) => {
                      setSelectedSample(e.target.value);
                      setSelectedSection(sampleSections[e.target.value]?.[0]?.file_name || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="intro-statistics">Introduction to Statistics</option>
                    <option value="ml-basics">Machine Learning Basics</option>
                    <option value="advanced-data-analysis">Advanced Data Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sampleSections[selectedSample]?.map((section) => (
                      <option key={section.id} value={section.file_name}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {testMode === 'mock' ? 'Mock Content' : 'Storage Path'}
                </h4>
                <code className="text-xs text-blue-700 dark:text-blue-300 break-all">
                  {testMode === 'mock' 
                    ? `Mock: ${selectedSample}/${selectedSection}`
                    : `storage-samples/courses/${selectedSample}/${selectedSection}`
                  }
                </code>
              </div>

              {testMode === 'storage' && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Upload className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        Upload Required
                      </h4>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        Upload the storage-samples/courses folder to your Supabase Storage 'courses' bucket to test with real storage.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - CourseRenderer */}
          <div className="lg:col-span-3">
            {currentSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                {testMode === 'mock' ? (
                  <MockCourseRenderer
                    section={currentSection}
                    content={mockContent[`${selectedSample}/${selectedSection}`] || 'Content not found'}
                  />
                ) : (
                  <CourseRenderer
                    section={currentSection}
                    storagePath={`storage-samples/courses/${selectedSample}`}
                    onSectionComplete={handleSectionComplete}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No section selected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How to Test CourseRenderer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Mock Mode (Current):
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Uses embedded MDX content for testing</li>
                <li>• No Supabase Storage setup required</li>
                <li>• Demonstrates all CourseRenderer features</li>
                <li>• Perfect for development and testing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Storage Mode:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Requires uploading MDX files to Supabase Storage</li>
                <li>• Tests real storage integration</li>
                <li>• Upload storage-samples/courses/* to 'courses' bucket</li>
                <li>• Maintains folder structure in storage</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Features You Can Test:
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
                  <li>• MDX content rendering with custom styling</li>
                  <li>• Section completion tracking and progress</li>
                  <li>• Responsive design and dark mode support</li>
                  <li>• Interactive elements and code highlighting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCourseRenderer;