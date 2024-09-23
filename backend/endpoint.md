# **API Documentation for Question Bank and Exam Management**

## **Endpoints**

### 1. **GET `/v1/question-bank`**

#### **Description**:

Fetches the list of all questions in the question bank.

- **Request Parameters**: None
- **Response**:
  ```json
  {
    "questions": [
      {
        "id": "string",
        "desc": "string",
        "type": "string", // Either "mcq" or "code"
        "difficulty": "string", // "easy", "medium", or "hard"
        "tags": ["string"], // Array of tags
        "grade": "string", // Grade or marks for the question
        "choices": ["string"], // For MCQ, an array of options (can be empty for non-MCQ)
        "testCases": ["string"], // For Code, an array of test cases (can be empty for non-code)
        "code": "string" // For Code questions, the starter code or template
      }
    ]
  }
  ```
- **Errors**:
  - `500 Internal Server Error`: Issue fetching questions from the database.

---

### 2. **POST `/v1/question-bank`**

#### **Description**:

Creates a new question or updates an existing question in the question bank.

- **Request Payload**:
  ```json
  {
    "questions": [
      {
        "id": "string", // Optional when creating new, required for updates
        "desc": "string", // Question description
        "type": "string", // "mcq" or "code"
        "difficulty": "string", // "easy", "medium", or "hard"
        "tags": ["string"], // Array of tags
        "grade": "string", // Grade or marks for the question
        "choices": ["string"], // Array of options (for MCQ type questions)
        "testCases": ["string"], // Array of test cases (for Code type questions)
        "code": "string" // Starter code for Code type questions
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "resData": {
      "message": "Question saved successfully"
    },
    "error": null
  }
  ```
- **Errors**:
  - `400 Bad Request`: Invalid input data.
  - `500 Internal Server Error`: Issue saving the question.

---

### 3. **POST `/v1/question-bank/{questionId}/delete`**

#### **Description**:

Deletes a question from the question bank based on its ID.

- **Request Parameters**:
  - `questionId`: ID of the question to be deleted.
- **Request Payload**: None

- **Response**:
  ```json
  {
    "message": "Question deleted successfully",
    "error": null
  }
  ```
- **Errors**:
  - `404 Not Found`: Question with the specified ID not found.
  - `500 Internal Server Error`: Error deleting the question.

---

### 4. **GET `/v1/exams`**

#### **Description**:

Fetches a list of all available exams.

- **Request Parameters**: None

- **Response**:
  ```json
  {
    "exams": [
      {
        "id": "string", // Exam ID
        "name": "string" // Exam name
      }
    ]
  }
  ```
- **Errors**:
  - `500 Internal Server Error`: Error fetching exams from the database.

---

### 5. **POST `/v1/exam/add-question`**

#### **Description**:

Adds a question to an exam.

- **Request Payload**:
  ```json
  {
    "questionId": "string", // ID of the question
    "examId": "string" // ID of the exam
  }
  ```
- **Response**:
  ```json
  {
    "message": "Question added to exam successfully",
    "error": null
  }
  ```
- **Errors**:
  - `404 Not Found`: The specified question or exam not found.
  - `500 Internal Server Error`: Error adding the question to the exam.

---

### 6. **POST `/v1/exam/remove-question`**

#### **Description**:

Removes a question from a specific exam.

- **Request Payload**:
  ```json
  {
    "questionId": "string", // ID of the question
    "examId": "string" // ID of the exam
  }
  ```
- **Response**:
  ```json
  {
    "message": "Question removed from exam successfully",
    "error": null
  }
  ```
- **Errors**:
  - `404 Not Found`: The specified question or exam not found.
  - `500 Internal Server Error`: Error removing the question from the exam.

---

## **Field Descriptions**

### **Question Object Fields**:

| Field        | Type       | Description                                  | Required           |
| ------------ | ---------- | -------------------------------------------- | ------------------ |
| `id`         | `string`   | Unique ID for the question (auto-generated)  | Optional (for new) |
| `desc`       | `string`   | Description or text of the question          | Yes                |
| `type`       | `string`   | Type of the question: "mcq" or "code"        | Yes                |
| `difficulty` | `string`   | Difficulty level: "easy", "medium", "hard"   | Optional           |
| `tags`       | `string[]` | Array of tags for categorization             | Optional           |
| `grade`      | `string`   | Marks assigned to the question               | Optional           |
| `choices`    | `string[]` | List of options (for MCQ type questions)     | Optional           |
| `testCases`  | `string[]` | List of test cases (for Code type questions) | Optional           |
| `code`       | `string`   | Starter code (for Code type questions)       | Optional           |

### **Exam Object Fields**:

| Field  | Type     | Description               |
| ------ | -------- | ------------------------- |
| `id`   | `string` | Unique ID for the exam    |
| `name` | `string` | Name or title of the exam |

---

## **Example Requests and Responses**

### **1. Fetch All Questions**

**Request**:

```http
GET /v1/question-bank
```

**Response**:

```json
{
  "questions": [
    {
      "id": "1",
      "desc": "What is React?",
      "type": "mcq",
      "difficulty": "easy",
      "tags": ["frontend", "javascript"],
      "grade": "5",
      "choices": ["Library", "Framework", "Language", "Compiler"]
    },
    {
      "id": "2",
      "desc": "Write a function to reverse a string.",
      "type": "code",
      "difficulty": "medium",
      "tags": ["algorithm", "string"],
      "grade": "10",
      "testCases": ["'abc' => 'cba'", "'hello' => 'olleh'"],
      "code": "function reverseString(str) { }"
    }
  ]
}
```

---

### **2. Add a Question**

**Request**:

```http
POST /v1/question-bank
```

**Payload**:

```json
{
  "questions": [
    {
      "desc": "What is JSX?",
      "type": "mcq",
      "difficulty": "easy",
      "tags": ["react", "frontend"],
      "grade": "5",
      "choices": ["Syntax Extension", "Library", "Component", "Framework"]
    }
  ]
}
```

**Response**:

```json
{
  "resData": {
    "message": "Question saved successfully"
  },
  "error": null
}
```

---

This Markdown documentation should now be shareable and give a clear picture of the backend endpoints and expected data formats for the question bank and exam management system.
