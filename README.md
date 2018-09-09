# CSFirstOffline
CSFirstOffline is collection of modified applications and libraries to run CSFirst (www.cs-first.com) classes in remote locations.

CSFirstOffline was created in order to support remote locations and organizations with either slow internet connections or 
those who can not afford to have one. If you are in similar situation, this will solve it for you.

## **Important notes:**
* CSFirstOffline works by serving content from several websites (http://scratch.mit.edu, www.cs-first.com, files.cs-first.com) from  webserver running on Raspberry PI in local network. Do not try to run classes with this setup if you are connected to internet, the sites mentioned will not work because they will be redirected to Raspberry PI.

* **Cost of setup using CSFirstOffline is very low.** You need Raspberry PI (preferably Model 2), 16Gb SD Card for the firwmare and  wired or wireless router that is capable of providing DHCP/DNS service with ability to forward requests. Setup steps are in [a INSTALL](INSTALL) file.

* We are likely going to offer turn-key solutions that include both PI and router later. Please check for updates in this file and we will provide contact information.

  * Experience with CSFirstOffline will be slightly different than it is with original CSFirst classes.
    It is advised that you become very familiar with the differences in order to start you classes.
    The most important differences are:
      * You are not going to run Scratch, instead you will be running Snap which is Javascript open source version of Scratch.
        Snap user interface is almost exactly the same as desktop version of Scratch, but different than online version of Scratch.
        Please make sure you become familiar with the differences as you will have to explain these to kids.

      * Class management / student file management has been added to CSFirstOffline, please make sure
        you understand how it works. You will be able to access it at scratch.mit.edu/admin.php when your setup is completed.

      * If you have any questions or suggestions to add to this guide, please let us know!
