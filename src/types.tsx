export enum Language {
  JAVA = "Java",
  PYTHON = "Python",
}

export interface Experiment {
  id: number;
  title: string;
  requirement: string;
  analysis: string;
  design: {
    structure: string;
    fields?: string[];
    methods?: string[];
    algorithm: string[];
    classDiagram: string;
    flowchart: string;
  };
  implementations: {
    [key in Language]?: string;
  };
  testing: string;
  designIssues: {
    [key in Language]?: string[];
  };
  generateTestCase: (seed: string) => {
    inputs: Record<string, string | number>;
    expected: string;
  };
}

const getSeedValue = (str: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash + index);
};

export const experiments: Experiment[] = [
  {
    id: 1,
    title: "Queue Abstract Data Type",
    requirement: "Implement a Queue ADT (Abstract Data Type) supporting FIFO (First-In-First-Out) operations in both Java and Python.",
    analysis: "A Queue is a linear data structure that follows the FIFO principle. Operations include enqueue (adding to the rear) and dequeue (removing from the front). Logical complexity is O(1) for both operations if implemented correctly using linked structures or circular buffers.",
    generateTestCase: (seed) => {
      const v1 = (getSeedValue(seed, 1) % 100) + 1;
      const v2 = (getSeedValue(seed, 2) % 100) + 1;
      return {
        inputs: { "Element A": v1, "Element B": v2 },
        expected: `Enqueue order: [${v1}, ${v2}]. First Dequeue: ${v1}`
      };
    },
    design: {
      structure: "Queue Class / Interface",
      fields: ["Front", "Rear", "Size/Capacity"],
      methods: ["enqueue(element)", "dequeue()", "isEmpty()", "size()", "peek()"],
      algorithm: [
        "1. Initialization: Create a collection (linked list or dynamic array) to hold elements.",
        "2. Enqueue: Accept a new element T, append it to the rear of the collection. Update size.",
        "3. Dequeue: Check if size > 0. If True, remove element at index 0 and return it; if False, throw Underflow error.",
        "4. Peek: Return element at index 0 without removal if size > 0."
      ],
      classDiagram: "┌───────────────────────┐\n│       QueueADT<T>     │\n├───────────────────────┤\n│ - elements: List<T>   │\n├───────────────────────┤\n│ + enqueue(item: T)    │\n│ + dequeue(): T        │\n│ + isEmpty(): Boolean  │\n└───────────────────────┘",
      flowchart: "[Start] \n   | \n[Input Item] \n   | \n(Is Full?) --Yes--> [Throw Overflow] \n   | No \n[Add to Tail] \n   | \n[Update Count] \n   | \n[End]",
    },
    implementations: {
      [Language.JAVA]: `import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * Queue Implementation using LinkedList in Java
 * Supports standard FIFO operations
 */
public class QueueADT<T> {
    private LinkedList<T> list = new LinkedList<>();

    public void enqueue(T item) {
        list.addLast(item);
    }

    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return list.removeFirst();
    }

    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return list.getFirst();
    }

    public boolean isEmpty() {
        return list.isEmpty();
    }

    public int size() {
        return list.size();
    }

    public static void main(String[] args) {
        QueueADT<Integer> queue = new QueueADT<>();
        queue.enqueue(10);
        queue.enqueue(20);
        System.out.println("Dequeued: " + queue.dequeue()); // Output: 10
        System.out.println("Peek: " + queue.peek()); // Output: 20
    }
}`,
      [Language.PYTHON]: `class QueueADT:
    """
    Queue Implementation using Python list
    In production, collections.deque is preferred for O(1) efficiency.
    """
    def __init__(self):
        self.queue = []

    def enqueue(self, item):
        self.queue.append(item)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Dequeue from an empty queue")
        return self.queue.pop(0)

    def peek(self):
        if self.is_empty():
            raise IndexError("Peek from an empty queue")
        return self.queue[0]

    def is_empty(self):
        return len(self.queue) == 0

    def size(self):
        return len(self.queue)

if __name__ == "__main__":
    q = QueueADT()
    q.enqueue("Experiment")
    q.enqueue("CS")
    print(f"Dequeued: {q.dequeue()}") # Output: Experiment
    print(f"Is Empty: {q.is_empty()}") # Output: False
`,
    },
    testing: "Test Case 1: Enqueue 10, 20. Dequeue -> Expect 10. Test Case 2: Dequeue on empty queue -> Expect Exception/Error.",
    designIssues: {
      [Language.JAVA]: [
        "Use explicit generics for type safety.",
        "Handle NoSuchElementException for empty state.",
        "Prefer LinkedList for O(1) insertion/deletion at ends."
      ],
      [Language.PYTHON]: [
        "Note: pop(0) on lists is O(n); use collections.deque for O(1).",
        "Handle IndexError for empty queue access.",
        "Dynamic typing simplifies element storage but requires careful runtime checks."
      ],
    },
  },
  {
    id: 2,
    title: "Quadratic Equation and Exception Handling",
    requirement: "Convert a Python quadratic equation solver into Java. The Java version must explicitly throw an ArithmeticException if 'a' is zero to prevent division by zero.",
    analysis: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. If a = 0, the denominator becomes 0, rendering the formula invalid and representing a linear equation rather than a quadratic one.",
    generateTestCase: (seed) => {
      const a = (getSeedValue(seed, 3) % 10) + 1;
      const b = (getSeedValue(seed, 4) % 20) - 10;
      const c = (getSeedValue(seed, 5) % 10);
      return {
        inputs: { a, b, c },
        expected: `Discriminant: ${b*b - 4*a*c}. Solution requires handling specific D value.`
      };
    },
    design: {
      structure: "QuadraticSolver Class",
      methods: ["solve(double a, double b, double c)", "getDiscriminant()"],
      algorithm: [
        "1. Input the coefficients a, b, and c.",
        "2. Pre-condition Check: If a == 0, the equation is not quadratic. Throw ArithmeticException.",
        "3. Calculation: Compute discriminant D = b^2 - 4ac.",
        "4. Branching Logic:",
        "   - If D > 0: Two real roots x1, x2.",
        "   - If D == 0: One real root x.",
        "   - If D < 0: Complex or no real roots.",
        "5. Print/Return result."
      ],
      classDiagram: "┌───────────────────────────┐\n│     QuadraticEquation     │\n├───────────────────────────┤\n│ + solve(a,b,c): void      │\n├───────────────────────────┤\n│ @throws: ArithmeticExc    │\n└───────────────────────────┘",
      flowchart: "[Start] -> [Input a,b,c] -> {a == 0?} \n   | No                | Yes\n   v                   v\n[Calc b^2-4ac]    [Throw Exception]\n   | \n{D > 0?} --Yes--> [Calc 2 Roots] \n   | No \n   v \n[Check D=0...] -> [End]",
    },
    implementations: {
      [Language.JAVA]: `import java.util.Scanner;

public class QuadraticEquation {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Enter a, b, c: ");
        double a = input.nextDouble();
        double b = input.nextDouble();
        double c = input.nextDouble();

        try {
            solve(a, b, c);
        } catch (ArithmeticException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    public static void solve(double a, double b, double c) {
        // Explicitly check for division by zero risk
        if (a == 0) {
            throw new ArithmeticException("Division by zero (a cannot be 0)");
        }

        double discriminant = Math.pow(b, 2) - 4 * a * c;

        if (discriminant > 0) {
            double r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            double r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            System.out.println("The roots are " + r1 + " and " + r2);
        } else if (discriminant == 0) {
            double r1 = -b / (2 * a);
            System.out.println("The root is " + r1);
        } else {
            System.out.println("The equation has no real roots");
        }
    }
}`,
      [Language.PYTHON]: `import math

def solve_quadratic(a, b, c):
    if a == 0:
        print("Not a quadratic equation (a=0)")
        return

    discriminant = b**2 - 4*a*c
    
    if discriminant > 0:
        root1 = (-b + math.sqrt(discriminant)) / (2 * a)
        root2 = (-b - math.sqrt(discriminant)) / (2 * a)
        print(f"Roots: {root1}, {root2}")
    elif discriminant == 0:
        root = -b / (2 * a)
        print(f"Root: {root}")
    else:
        print("No real roots")

# Usage
solve_quadratic(1, -3, 2) # x^2 - 3x + 2 = 0
`,
    },
    testing: "Test Case 1: a=1, b=-3, c=2. Result: Roots 1.0, 2.0. Test Case 2: a=0. Result: Java throws ArithmeticException.",
    designIssues: {
      [Language.JAVA]: [
        "Explicit ArithmeticException required for a=0 constraint.",
        "Use Math.sqrt and Math.pow for precision.",
        "Scanner for input handling with error isolation."
      ],
      [Language.PYTHON]: [
        "Relies on conditional checking for a=0.",
        "Floating point precision depends on Python math module.",
        "Dynamic interpretation handles invalid math inputs differently."
      ],
    },
  },
  {
    id: 3,
    title: "2×2 Linear Equation Class",
    requirement: "Design a LinearEquation class for the system: ax+by=e and cx+dy=f. Fields must be private. Implement getters and check for solvability.",
    analysis: "Solvability is determined by the determinant (ad - bc). If the determinant is 0, the system has no unique solution. Crammer's Rule is used to find x and y.",
    generateTestCase: (seed) => {
      const a = (getSeedValue(seed, 6) % 9) + 1;
      const b = (getSeedValue(seed, 7) % 9) + 1;
      const e = (getSeedValue(seed, 8) % 15) + 1;
      return {
        inputs: { a, b, c: 3, d: -5, e, f: 8 },
        expected: `System: ${a}x + ${b}y = ${e}, 3x - 5y = 8. Det: ${a*-5 - b*3}`
      };
    },
    design: {
      structure: "LinearEquation Class",
      fields: ["a, b, c, d, e, f (private doubles)"],
      methods: ["Constructor", "getters for all", "isSolvable()", "getX()", "getY()"],
      algorithm: [
        "1. Define private state for constants a, b, c, d, e, f.",
        "2. Implement isSolvable(): Determinant (ad - bc) must not be zero.",
        "3. Apply Cramer's Rule:",
        "   - X = (ed - bf) / determinant.",
        "   - Y = (af - ec) / determinant."
      ],
      classDiagram: "┌───────────────────────┐\n│    LinearEquation     │\n├───────────────────────┤\n│ - a,b,c,d,e,f: double │\n├───────────────────────┤\n│ + isSolvable(): bool  │\n│ + getX(): double      │\n│ + getY(): double      │\n└───────────────────────┘",
      flowchart: "[Input] -> [Determinant] -> {Det == 0?}\n   | No              | Yes\n   v                 v\n[Calc X,Y]        [Unsolvable]",
    },
    implementations: {
      [Language.JAVA]: `public class LinearEquation {
    private double a, b, c, d, e, f;

    public LinearEquation(double a, double b, double c, double d, double e, double f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    public boolean isSolvable() {
        return (a * d - b * c) != 0;
    }

    public double getX() {
        return (e * d - b * f) / (a * d - b * c);
    }

    public double getY() {
        return (a * f - e * c) / (a * d - b * c);
    }

    // Getters
    public double getA() { return a; }
    public double getB() { return b; }
    public double getC() { return c; }
    public double getD() { return d; }
    public double getE() { return e; }
    public double getF() { return f; }
}`,
      [Language.PYTHON]: `class LinearEquation:
    def __init__(self, a, b, c, d, e, f):
        self.__a = a
        self.__b = b
        self.__c = c
        self.__d = d
        self.__e = e
        self.__f = f

    def is_solvable(self):
        return (self.__a * self.__d - self.__b * self.__c) != 0

    def get_x(self):
        return (self.__e * self.__d - self.__b * self.__f) / (self.__a * self.__d - self.__b * self.__c)

    def get_y(self):
        return (self.__a * self.__f - self.__e * self.__c) / (self.__a * self.__d - self.__b * self.__c)

    # Getters
    def get_a(self): return self.__a
    # ... and so on for b, c, d, e, f
`,
    },
    testing: "System: 9x+4y=7, 3x-5y=8. Result: Calculate x and y or verify solvability.",
    designIssues: {
      [Language.JAVA]: [
        "Strict encapsulation using private fields.",
        "Getter methods follow naming conventions (getA, getB).",
        "Deterministic floating point calculations."
      ],
      [Language.PYTHON]: [
        "Private fields using double underscord (__a).",
        "Getter methods provide controlled access to private state.",
        "Simplified class definition compared to Java's verbosity."
      ],
    },
  },
  {
    id: 4,
    title: "Inheritance and Polymorphism",
    requirement: "Implement a base Professor class and a subclass EmeritusProfessor in Java. Overwrite the net pay calculation logic.",
    analysis: "Inheritance allows reuse of common professor attributes. Polymorphism enables the overriding of the getNetPay() method to handle specific business logic for Emeritus status.",
    generateTestCase: (seed) => {
      const gPay = (getSeedValue(seed, 9) % 50) * 100 + 3000;
      const ded = (getSeedValue(seed, 10) % 10) * 100 + 500;
      return {
        inputs: { "Gross Pay": gPay, "Deductions": ded },
        expected: `Professor Net: ${gPay - ded}, Emeritus Net: 0`
      };
    },
    design: {
      structure: "Professor (Base) -> EmeritusProfessor (Subclass)",
      fields: ["firstName, lastName, ninNumber, grossPay, deductions"],
      methods: ["getNetPay()", "toString()"],
      algorithm: [
        "1. Define Base Class Professor with standard pay calculation: gross - deductions.",
        "2. Establish Subclass EmeritusProfessor inheriting from Professor.",
        "3. Apply Method Overriding: Redefine getNetPay() specifically for the subclass.",
        "4. Logic: Always return zero for Emeritus, ignoring calculations in the base."
      ],
      classDiagram: "┌───────────────────────┐\n│      Professor        │\n├───────────────────────┤\n│ - grossPay: double    │\n│ - deductions: double  │\n├───────────────────────┤\n│ + getNetPay(): double │\n└───────────┬───────────┘\n            ∆ (Inherit)\n┌───────────┴───────────┐\n│   EmeritusProfessor   │\n├───────────────────────┤\n│ + getNetPay(): double │\n└───────────────────────┘",
      flowchart: "[Create Person] -> {Instance Type?} \n   | Professor          | Emeritus \n   v                    v\n[Gross - Ded]        [Return 0]\n   |                    |\n   └───────> [End] <────┘",
    },
    implementations: {
      [Language.JAVA]: `public class Professor {
    private String firstName;
    private String lastName;
    private String ninNumber;
    private double grossPay;
    private double deductions;

    public Professor(String firstName, String lastName, String ninNumber, double grossPay, double deductions) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.ninNumber = ninNumber;
        this.grossPay = grossPay;
        this.deductions = deductions;
    }

    public double getNetPay() {
        return grossPay - deductions;
    }

    @Override
    public String toString() {
        return firstName + " " + lastName + " (NIN: " + ninNumber + ")";
    }
}

class EmeritusProfessor extends Professor {
    public EmeritusProfessor(String firstName, String lastName, String ninNumber, double grossPay, double deductions) {
        super(firstName, lastName, ninNumber, grossPay, deductions);
    }

    @Override
    public double getNetPay() {
        return 0; // Emeritus professors return 0 net pay by requirement
    }
}

class Tester {
    public static void main(String[] args) {
        Professor p1 = new Professor("Jane", "Doe", "12345", 5000, 1000);
        Professor p2 = new EmeritusProfessor("John", "Smith", "99999", 5000, 1000);

        System.out.println(p1 + " Net Pay: " + p1.getNetPay()); // 4000.0
        System.out.println(p2 + " Emeritus Net Pay: " + p2.getNetPay()); // 0.0
    }
}`,
    },
    testing: "Instantiate Professor with (5000, 1000) -> Expect 4000. Instantiate EmeritusProfessor with any value -> Expect 0.",
    designIssues: {
      [Language.JAVA]: [
        "@Override annotation prevents signature mismatch errors.",
        "super() call required in subclass constructor.",
        "Demonstrates run-time polymorphism."
      ],
    },
  },
  {
    id: 5,
    title: "Matrix Operations",
    requirement: "Implement matrix transpose, addition, and multiplication in Python. Compare with a Java implementation.",
    analysis: "Matrix operations involve nested loops. Transpose swaps rows with columns, additions add corresponding elements, and multiplication involves dot products of rows and columns.",
    generateTestCase: (seed) => {
      const dim = (getSeedValue(seed, 11) % 2) + 2; // 2x2 or 3x3
      return {
        inputs: { "Dimensions": `${dim}x${dim}`, "Op": "Multiply" },
        expected: `Matrix multiply complexity: O(n^3). Test with ${dim}x${dim} identity.`
      };
    },
    design: {
      structure: "Mathematical functions",
      methods: ["transpose(matrix)", "add(A, B)", "multiply(A, B)"],
      algorithm: [
        "1. Transpose: For each column index j, create a new row from elements at index j across all original rows.",
        "2. Addition: Validate that row/column counts match. result[i][j] = A[i][j] + B[i][j].",
        "3. Multiplication: Validate Cols(A) == Rows(B). For each cell (i,j), accumulate sum of A[i][k] * B[k][j]."
      ],
      classDiagram: "┌─────────────────────────────────┐\n│         MatrixUtility           │\n├─────────────────────────────────┤\n│ + transpose(m: List<List>): List │\n│ + add(a, b: List<List>): List    │\n│ + multiply(a, b: List<List>): List│\n└─────────────────────────────────┘",
      flowchart: "[Input Matrix] -> [Index Loop (i)] -> [Index Loop (j)] -> [Math Operation] -> [Store Result] -> [End]",
    },
    implementations: {
      [Language.PYTHON]: `def transpose(matrix):
    return [[matrix[j][i] for j in range(len(matrix))] for i in range(len(matrix[0]))]

def add_matrices(A, B):
    if len(A) != len(B) or len(A[0]) != len(B[0]):
        raise ValueError("Matrices must have same dimensions")
    return [[A[i][j] + B[i][j] for j in range(len(A[0]))] for i in range(len(A))]

def multiply_matrices(A, B):
    if len(A[0]) != len(B):
        raise ValueError("Columns of A must match rows of B")
    
    result = [[0 for _ in range(len(B[0]))] for _ in range(len(A))]
    for i in range(len(A)):
        for j in range(len(B[0])):
            for k in range(len(B)):
                result[i][j] += A[i][k] * B[k][j]
    return result

# Usage
mat1 = [[1, 2], [3, 4]]
mat2 = [[5, 6], [7, 8]]
print("Sum:", add_matrices(mat1, mat2))
print("Product:", multiply_matrices(mat1, mat2))
`,
    },
    testing: "Input: 2x2 Identity matrix. Output of multiplication with any matrix should be itself. Test addition with zero matrix.",
    designIssues: {
      [Language.PYTHON]: [
        "List comprehensions are readable but can be slower than vector operations.",
        "Manual validation of dimensions is critical to avoid IndexError.",
        "Scale poorly compared to NumPy."
      ],
      [Language.JAVA]: [
        "Requires manual multidimensional array handling.",
        "Nested loops (Triple loop for multiplication) is the standard approach.",
        "Strict type enforcement for numerical stability."
      ],
    },
  },
];
