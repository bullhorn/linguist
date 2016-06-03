import { Check } from 'linguist';

describe('Check', function() {
    describe('with simple queries', () => {
        let command = new Check();

        it('should do something', (done) => {
            let read = command.run('en', {
                source: './test/tmp/**/*',
                dest: './test/l10n'
            });
            read.on('end', (data) => {
                console.log(`found keys`, data);
                expect(data).toBeDefined();
                done();
            });
        });
    });
});
