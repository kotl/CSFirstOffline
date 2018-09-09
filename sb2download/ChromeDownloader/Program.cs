using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace ChromeDownloader
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("Usage: ChromeDownloader outputDir links.txt");
                return;
            }
            string outputDir = args[0];
            string[] links = File.ReadAllLines(args[1]);
            foreach (string line in links)
            {
                var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                String[] files = Directory.GetFiles(userProfile, "*.sb2");
                ChromeOptions options = new ChromeOptions();
                options.AddUserProfilePreference("profile.default_content_setting_values.plugins", 1);
                options.AddUserProfilePreference("profile.content_settings.plugin_whitelist.adobe-flash-player", 1);
                options.AddUserProfilePreference("profile.content_settings.exceptions.plugins.*,*.per_resource.adobe-flash-player", 1);
                // Enable Flash for this site
                options.AddUserProfilePreference("PluginsAllowedForUrls", "https://scratch.mit.edu");
                String chromeDriverPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
                OpenQA.Selenium.Chrome.ChromeDriver driver = new OpenQA.Selenium.Chrome.ChromeDriver(chromeDriverPath, options);
                var navigate = driver.Navigate();
                string link = line;
                if (!link.Contains("/#editor")) {
                    link += "/#editor";
                }
                Regex r= new Regex(@"/projects/(\d+)");
                string projectNumber = r.Match(link).Groups[1].Value;
                navigate.GoToUrl(link);
                System.Threading.Thread.Sleep(10000);
                while (true)
                {
                    var scr1 = driver.GetScreenshot();
                    string tempFile = Path.GetTempFileName();
                    scr1.SaveAsFile(tempFile, ImageFormat.Png);
                    var img = Image.FromFile(tempFile);
                    Bitmap bitmap = new Bitmap(img);
                    img.Dispose();
                    File.Delete(tempFile);
                    Color c = bitmap.GetPixel(6, 6);
                    if (c.ToArgb() != unchecked((int)(0xff9c9ea2)))
                    {
                        Console.WriteLine("Waiting for load to finish...");
                        System.Threading.Thread.Sleep(5000);
                        continue;
                    }
                    Console.WriteLine("Waiting...");
                    System.Threading.Thread.Sleep(5000);
                    scr1.SaveAsFile("scr1.png", ImageFormat.Png);
                    var scr2 = driver.GetScreenshot();
                    scr2.SaveAsFile("scr2.png", ImageFormat.Png);
                    if (scr1.AsBase64EncodedString.CompareTo(scr2.AsBase64EncodedString) == 0)
                    {
                        break;
                    }
                    File.WriteAllText("scr1.txt", scr1.AsBase64EncodedString);
                    File.WriteAllText("scr2.txt", scr2.AsBase64EncodedString);
                }
                var scr = driver.GetScreenshot();
                scr.SaveAsFile("final.png", ImageFormat.Png);

                var el = driver.FindElementById("player");
                OpenQA.Selenium.Interactions.Actions builder = new OpenQA.Selenium.Interactions.Actions(driver);
                builder.MoveToElement(el, 130,17).Click().Build().Perform();
                System.Threading.Thread.Sleep(200);
                builder.MoveToElement(el, 180, 104).Click().Build().Perform();
                System.Threading.Thread.Sleep(5000);
                builder.MoveToElement(el, 680, 380).Click().Build().Perform();
                builder.MoveToElement(el, 480, 480).Click().Build().Perform();
                System.Threading.Thread.Sleep(10000);
                SendKeys.SendWait(@"{Enter}");
                System.Threading.Thread.Sleep(5000);
                driver.Close();
                String[] newfiles = Directory.GetFiles(userProfile, "*.sb2");
                foreach(String file in newfiles) {
                    if (!files.Contains(file))
                    {
                        // Found it!
                        Directory.CreateDirectory(Path.Combine(outputDir, projectNumber));
                        File.Create(Path.Combine(outputDir, projectNumber, Path.GetFileNameWithoutExtension(file) + ".txt"));
                        File.WriteAllText(Path.Combine(outputDir, projectNumber, "name.txt"), Path.GetFileNameWithoutExtension(file));
                        File.Move(file, Path.Combine(outputDir, projectNumber, "index.sb2"));
                        break;
                    }
                }
            }
        }
    }
}
