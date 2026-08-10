using System;
using System.Net;
using System.IO;

class Program {
    static void Main() {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:8080/");
        listener.Start();
        Console.WriteLine("Server started at http://localhost:8080/");
        while (true) {
            HttpListenerContext context = listener.GetContext();
            string path = context.Request.Url.LocalPath.TrimStart('/');
            if (string.IsNullOrEmpty(path)) path = "index.html";
            string fullPath = Path.Combine(@"c:\Users\OR\Downloads\thies resto", path.Replace('/', '\\'));
            
            if (File.Exists(fullPath)) {
                byte[] buffer = File.ReadAllBytes(fullPath);
                context.Response.ContentLength64 = buffer.Length;
                string ext = Path.GetExtension(fullPath).ToLower();
                if (ext == ".html") context.Response.ContentType = "text/html; charset=utf-8";
                else if (ext == ".js") context.Response.ContentType = "application/javascript; charset=utf-8";
                else if (ext == ".css") context.Response.ContentType = "text/css";
                else if (ext == ".json") context.Response.ContentType = "application/json";
                context.Response.OutputStream.Write(buffer, 0, buffer.Length);
            } else {
                context.Response.StatusCode = 404;
            }
            context.Response.OutputStream.Close();
        }
    }
}
