<?php

/**
 *  Print out configuration that should be used for DNSMasq service in the router.
 *
 * @author     kotl@github.com
 * @copyright  2015 Sergei Kotlyachkov
 * @license    CC BY-NC-ND 3.0 https://creativecommons.org/licenses/by-nc-nd/3.0/
 *
 */

// This file must match dns/cs.conf

print "<pre>";
$ADDR = $_SERVER['SERVER_ADDR'];
print "Copy these settings into dnsmasq configuration of the router:\n";
print "\naddress=/cs/" . $ADDR;
print "\naddress=/cs-first.com/" . $ADDR;
print "\naddress=/www.cs-first.com/" . $ADDR;
print "\naddress=/files.cs-first.com/" . $ADDR;
print "\naddress=/scratch/" . $ADDR;
print "\naddress=/scratch.mit.edu/" . $ADDR;
print "\naddress=/www.google.com/" . $ADDR;
print "\naddress=/js-agent.newrelic.com/" . $ADDR;
print "\naddress=/fonts.googleapis.com/" . $ADDR;
print "\n";
print "</pre>";
?>
