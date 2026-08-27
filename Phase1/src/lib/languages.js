export const LANGUAGES = [
  {
    id: "javascript",
    label: "JavaScript (Node.js 18)",
    monaco: "javascript",
    judge0Id: 63,
    defaultCode: `function solve(nums) {
  // Write your solution here

}`,
  },
  {
    id: "typescript",
    label: "TypeScript (4.9)",
    monaco: "typescript",
    judge0Id: 74,
    defaultCode: `function solve(nums: number[]): number[] {
  // Write your solution here
  return nums;
}`,
  },
  {
    id: "python311",
    label: "Python 3.11",
    monaco: "python",
    judge0Id: 71,
    defaultCode: `def solve(nums):
    # Write your solution here
    pass`,
  },
  {
    id: "python27",
    label: "Python 2.7",
    monaco: "python",
    judge0Id: 70,
    defaultCode: `def solve(nums):
    # Write your solution here
    pass`,
  },
  {
    id: "java17",
    label: "Java 17 (OpenJDK)",
    monaco: "java",
    judge0Id: 62,
    compilerOptions: "--release 17",
    defaultCode: `class Solution {
    public int[] solve(int[] nums) {
        // Write your solution here
        return nums;
    }
}`,
  },
  {
    id: "cpp17",
    label: "C++ 17 (GCC 9.2)",
    monaco: "cpp",
    judge0Id: 54,
    compilerOptions: "-std=c++17",
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums) {
        // Write your solution here
        return nums;
    }
};`,
  },
  {
    id: "cpp20",
    label: "C++ 20 (GCC 9.2)",
    monaco: "cpp",
    judge0Id: 54,
    compilerOptions: "-std=c++2a",
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums) {
        // Write your solution here
        return nums;
    }
};`,
  },
  {
    id: "c",
    label: "C (GCC 9.2)",
    monaco: "c",
    judge0Id: 50,
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

int* solve(int* nums, int numsSize, int* returnSize) {
    // Write your solution here
    *returnSize = numsSize;
    return nums;
}`,
  },
  {
    id: "csharp",
    label: "C# (Mono 6.6)",
    monaco: "csharp",
    judge0Id: 51,
    defaultCode: `using System;

public class Solution {
    public int[] Solve(int[] nums) {
        // Write your solution here
        return nums;
    }
}`,
  },
  {
    id: "go",
    label: "Go (1.13.5)",
    monaco: "go",
    judge0Id: 60,
    defaultCode: `package main

func solve(nums []int) []int {
    // Write your solution here
    return nums
}`,
  },
  {
    id: "rust",
    label: "Rust (1.40)",
    monaco: "rust",
    judge0Id: 73,
    defaultCode: `fn solve(nums: Vec<i32>) -> Vec<i32> {
    // Write your solution here
    nums
}`,
  },
  {
    id: "kotlin",
    label: "Kotlin (1.3.70)",
    monaco: "kotlin",
    judge0Id: 78,
    defaultCode: `class Solution {
    fun solve(nums: IntArray): IntArray {
        // Write your solution here
        return nums
    }
}`,
  },
  {
    id: "ruby",
    label: "Ruby (2.7)",
    monaco: "ruby",
    judge0Id: 72,
    defaultCode: `def solve(nums)
  # Write your solution here
  nums
end`,
  },
  {
    id: "php",
    label: "PHP (7.4)",
    monaco: "php",
    judge0Id: 68,
    defaultCode: `<?php
function solve($nums) {
    // Write your solution here
    return $nums;
}`,
  },
  {
    id: "swift",
    label: "Swift (5.2)",
    monaco: "swift",
    judge0Id: 83,
    defaultCode: `class Solution {
    func solve(_ nums: [Int]) -> [Int] {
        // Write your solution here
        return nums
    }
}`,
  },
];

export const getLanguageById = (id) =>
  LANGUAGES.find((lang) => lang.id === id) || LANGUAGES[0];

export const DEFAULT_LANGUAGE_ID = "cpp17";
