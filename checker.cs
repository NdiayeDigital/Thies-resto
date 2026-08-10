using System;
using System.IO;

class Program {
    static void Main(string[] args) {
        string text = File.ReadAllText(args[0]);
        int braceDepth = 0;
        bool inString = false;
        char stringChar = '\0';
        bool inComment = false;
        bool inBlockComment = false;
        
        for (int i = 0; i < text.Length; i++) {
            char c = text[i];
            
            if (inComment) {
                if (c == '\n') inComment = false;
                continue;
            }
            if (inBlockComment) {
                if (c == '*' && i + 1 < text.Length && text[i+1] == '/') {
                    inBlockComment = false;
                    i++;
                }
                continue;
            }
            
            if (inString) {
                if (c == '\\') { i++; continue; }
                if (c == stringChar) { inString = false; }
                continue;
            }
            
            if (c == '/' && i + 1 < text.Length) {
                if (text[i+1] == '/') { inComment = true; i++; continue; }
                if (text[i+1] == '*') { inBlockComment = true; i++; continue; }
            }
            
            if (c == '"' || c == '\'' || c == '\x60') {
                inString = true;
                stringChar = c;
                continue;
            }
            
            if (c == '{') braceDepth++;
            if (c == '}') {
                braceDepth--;
                if (braceDepth < 0) {
                    Console.WriteLine("Negative brace depth at character " + i);
                    braceDepth = 0;
                }
            }
        }
        Console.WriteLine("Final brace depth: " + braceDepth);
        if (inString) Console.WriteLine("Unclosed string detected: " + stringChar);
    }
}
