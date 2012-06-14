Features list
=============
 
 +   In overall view create on click chart to drilldown for keyword position in time.

Bug list
========

 +   Validation for new job and edit forms.
 +   In job processing the keyword seaching should not be parallel, each search should be queued separately
 +   Handle the google search limits, stop further searches if CAPTCHA appears and do not change the job status to 'finished'
 +   Constraints for database collections (user - collection, email must be unique)
 +   Edit job should not allow to change the keywords set, because the previous jobs will remain without the results
 +   Also editing the 'Matching urls' should change the others jobs to same set
 +   Charts will not be displayed if there is problems with returning result data
 +   Detection for failed jobs, if some of the fields are null