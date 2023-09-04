import { useRouter } from "next/router";
import { withAuthServerSideProps } from "~/components/generic/withAuthServerSide";

export default function Main() {
    const router = useRouter();
    
    return (
        <div className="flex flex-col items-center justify-between gap-10">
            <h1 className="pt-6 text-3xl font-semibold"> Almanac </h1>
            <div className="text-center">
                According to all known laws of aviation, there is no way a bee
                should be able to fly. Its wings are too small to get its fat
                little body off the ground. The bee, of course, flies anyway
                because bees don't care what humans think is impossible. Yellow,
                black. Yellow, black. Yellow, black. Yellow, black. Ooh, black
                and yellow! Let's shake it up a little. Barry! Breakfast is
                ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan
                you believe this is happening? - I can't. I'll pick you up.
                Looking sharp. Use the stairs. Your father paid good money for
                those. Sorry. I'm excited. Here's the graduate. We're very proud
                of you, son. A perfect report card, all B's. Very proud. Ma! I
                got a thing going here. - You got lint on your fuzz. - Ow!
                That's me! - Wave to us! We'll be in row 118,000. - Bye! Barry,
                I told you, stop flying in the house! - Hey, Adam. - Hey, Barry.
                - Is that fuzz gel? - A little. Special day, graduation. Never
                thought I'd make it. Three days grade school, three days high
                school. Those were awkward. Three days college. I'm glad I took
                a day and hitchhiked around the hive. You did come back
                different. - Hi, Barry. - Artie, growing a mustache? Looks good.
                - Hear about Frankie? - Yeah. - You going to the funeral? - No,
                I'm not going. Everybody knows, sting someone, you die. Don't
                waste it on a squirrel. Such a hothead. I guess he could have
                just gotten out of the way. I love this incorporating an
                amusement park into our day. That's why we don't need vacations.
                Boy, quite a bit of pomp... under the circumstances. - Well,
                Adam, today we are men. - We are! - Bee-men. - Amen! Hallelujah!
                Students, faculty, distinguished bees, please welcome Dean
                Buzzwell. Welcome, New Hive Oity graduating class of... ...9:15.
                That concludes our ceremonies. And begins your career at Honex
                Industries! Will we pick ourjob today? I heard it's just
                orientation. Heads up! Here we go. Keep your hands and antennas
                inside the tram at all times. - Wonder what it'll be like? - A
                little scary. Welcome to Honex, a division of Honesco and a part
                of the Hexagon Group. This is it! Wow. Wow. We know that you, as
                a bee, have worked your whole life to get to the point where you
                can work for your whole life. Honey begins when our valiant
                Pollen Jocks bring the nectar to the hive. Our top-secret
                formula is automatically color-corrected, scent-adjusted and
                bubble-contoured into this soothing sweet syrup with its
                distinctive golden glow you know as... Honey! - That girl was
                hot. - She's my cousin! - She is? - Yes, we're all cousins. -
                Right. You're right. - At Honex, we constantly strive to improve
                every aspect of bee existence. These bees are stress-testing a
                new helmet technology. - What do you think he makes? - Not
                enough. Here we have our latest advancement, the Krelman. - What
                does that do? - Oatches that little strand of honey that hangs
                after you pour it. Saves us millions. Oan anyone work on the
                Krelman? Of course. Most bee jobs are small ones. But bees know
                that every small job, if it's done well, means a lot. But choose
                carefully because you'll stay in the job you pick for the rest
                of your life. The same job the rest of your life? I didn't know
                that. What's the difference? You'll be happy to know that bees,
                as a species, haven't had one day off in 27 million years. So
                you'll just work us to death? We'll sure try. Wow! That blew my
                mind! "What's the difference?" How can you say that? One job
                forever? That's an insane choice to have to make. I'm relieved.
                Now we only have to make one decision in life. But, Adam, how
                could they never have told us that? Why would you question
                anything? We're bees. We're the most perfectly functioning
                society on Earth. You ever think maybe things work a little too
                well here? Like what? Give me one example. I don't know. But you
                know what I'm talking about. Please clear the gate. Royal Nectar
                Force on approach. Wait a second. Oheck it out. - Hey, those are
                Pollen Jocks! - Wow. I've never seen them this close. They know
                what it's like outside the hive. Yeah, but some don't come back.
                - Hey, Jocks! - Hi, Jocks! You guys did great! You're monsters!
                You're sky freaks! I love it! I love it! - I wonder where they
                were. - I don't know. Their day's not planned.
            </div>
            <button
                className="rounded-m border-2 border-black px-2 py-1 font-semibold"
                onClick={() => router.push('/')}
            >
                Dashboard
            </button>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();
