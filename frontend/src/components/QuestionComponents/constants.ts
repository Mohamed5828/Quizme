export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  sqlite3: "3.36.0",
} as const;

export const CODE_SNIPPETS = {
  javascript: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = '';

rl.on('line', (line) => {
    input += line;
});

rl.on('close', () => {
    const result = Solution.solve(input);
    console.log(result);
});

const Solution = {
    solve: function(input) {
        // Implement your solution here
        // Example: let result = ...

        return "";  // Replace this with your result
    }
};
`,
  python: `import sys

class Solution:
    def solve(self):
        # Read input
        input_data = sys.stdin.read().strip()
        
        # Implement your solution here
        # result = ...

        # Output the result
        # print(result)

if __name__ == "__main__":
    solution = Solution()
    solution.solve()
`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read input
        String input = scanner.nextLine();  // Modify based on the expected input format
        
        // Call the solution method
        String result = solve(input);
        
        // Output the result
        System.out.println(result);
    }

    public static String solve(String input) {
        // Implement your solution here
        // Example: String result = ...

        return "";  // Replace this with your result
    }
}
`,
  sqlite3: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);`,
} as const;

export type Language = keyof typeof LANGUAGE_VERSIONS;
