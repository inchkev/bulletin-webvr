#!c:\users\mykyt\desktop\yhack19\virt\scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'profanity==1.1','console_scripts','profanity'
__requires__ = 'profanity==1.1'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('profanity==1.1', 'console_scripts', 'profanity')()
    )
