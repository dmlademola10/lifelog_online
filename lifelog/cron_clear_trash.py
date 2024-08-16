try:
    import django
    import os, datetime, json
    from multiprocessing import Process

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lifelog_online.settings")
    django.setup()
    from lifelog.models import Event, Upload
    from lifelog import myutils
    from lifelog import views
    from lifelog_online.settings import MEDIA_ROOT

    events = Event.objects.filter(
        trashed_on__isnull=False,
    )

    for event in events:
        if datetime.datetime.now(
            django.utils.timezone.utc
        ) - event.trashed_on >= datetime.timedelta(days=30):
            upload_ids = json.loads(event.upload_ids)
            for upload_id in upload_ids:
                proc = Process(target=views.stream)
                proc.start()
                proc.terminate()
                os.unlink(
                    os.path.join(
                        "C:/Users/lenovo/projects/lifelog_online/media",
                        Upload.objects.get(id=upload_id).path,
                    ),
                )
                Upload.objects.get(id=upload_id).delete()

            Event.objects.filter(id=event.id).delete()
    logs = open("log.txt", "a")
    logs.write("\nRan at " + str(datetime.datetime.now()))

except BaseException as Argument:
    fil = open("errors_cron.txt", "a")
    fil.write(str(Argument) + " at " + str(datetime.datetime.now()))
