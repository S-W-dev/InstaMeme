using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InstaSharper;
using InstaSharper.API;
using InstaSharper.API.Builder;
using InstaSharper.Classes;
using InstaSharper.Logger;

namespace InstaMeme {
    class Program {

        #region Hidden
        private const string username = "InstaMeme1O1";
        private const string password = "Snakeman!30";
        #endregion
        private static UserSessionData user;
        private static IInstaApi api;

        static void Main(string[] args) {
        new discord().MainAsync().GetAwaiter().GetResult();
            user = new UserSessionData();
            user.UserName = username;
            user.Password = password;
            Login();
            Console.Read();
        }

        public static async void Login() {
            api = InstaApiBuilder.CreateBuilder()
                .SetUser(user).UseLogger(new DebugLogger(LogLevel.Exceptions))
                .Build();

            var logInRequest = await api.LoginAsync();
            if (logInRequest.Succeeded) {
                Console.WriteLine("Logged In!");
                Post(api);
            } else
                Console.WriteLine("Error Logging In!\n" + logInRequest.Info.Message);
        }
        public static async void Post(IInstaApi api) {
            api.UploadPhotoAsync("/Res/FirstMeme.png", "This is a meme");
        }
    }
}
