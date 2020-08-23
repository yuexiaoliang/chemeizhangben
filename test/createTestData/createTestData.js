const fs = require('fs');

const shortid = require('shortid');
const moment = require('moment');
const data = {};
const huiyuanshuliang = 200;
const huiyuanchongzhizuidacishu = 30;
const huiyuanxiaofeizuidacishu = 100;
const putongshuliang = 200;
const putongxiaofeizuidacishu = 100;

// 创建会员数据
(() => {
    // 添加会员
    for (let i = 0; i < huiyuanshuliang; i++) {
        const id = i;
        const date = randomDate();
        const name = randomName();
        const weixin = getRandom(100000, 1999999999);
        const shouji = getRandom(10000000000, 19999999999);
        const money = getRandom(100, 3000);
        const member = {
            id,
            date,
            name,
            contact: {
                weixin,
                shouji,
            },
            ramarks: getRandomRemark(),
            carList: [],
            balance: money,
            rechargeRecord: [[date, money, randomTerrace()]],
            expensesRecord: [],
        };

        for (let j = 0; j < getRandom(1, 5); j++) {
            member.carList.push([randomCarNumber(), randomCarName()]);
        }
        data[id] = member;
    }
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const member = data[key];
            // 添加充值记录
            (() => {
                for (
                    let j = 0;
                    j < getRandom(1, huiyuanchongzhizuidacishu);
                    j++
                ) {
                    const record = getRandomRechargeRecord();
                    const money = record[1];
                    member.balance += money;
                    member.rechargeRecord.unshift(record);
                }
            })();

            // 添加消费记录
            (() => {
                for (
                    let x = 0;
                    x < getRandom(1, huiyuanxiaofeizuidacishu);
                    x++
                ) {
                    const expenses = [];
                    for (let j = 0; j < getRandom(1, 3); j++) {
                        const item = getMemberServeOptions();
                        member.balance -= item[1];
                        expenses.unshift(item);
                    }
                    member.expensesRecord.unshift([randomDate(), expenses]);
                }
            })();
        }
    }

    // 写入文件
    fs.writeFile('./database/members.json', JSON.stringify(data), function (
        err
    ) {
        if (err) {
            return console.error(err);
        }
    });
})();

// 创建普通数据
(() => {
    let data = {};
    // 添加会员
    for (let i = 0; i < putongshuliang; i++) {
        const chepaihao = randomCarNumber();
        data[`${chepaihao}`] = {
            car: chepaihao,
            expensesRecord: [],
        };
        for (let x = 0; x < getRandom(1, putongxiaofeizuidacishu); x++) {
            const expenses = [];
            for (let j = 0; j < getRandom(1, 3); j++) {
                expenses.unshift(getCommonServeOptions());
            }
            data[`${chepaihao}`].expensesRecord.unshift([
                randomDate(),
                randomCarName(),
                randomTerrace(),
                expenses,
            ]);
        }
    }

    // 写入文件;
    fs.writeFile('./database/ordinary.json', JSON.stringify(data), function (
        err
    ) {
        if (err) {
            return console.error(err);
        }
    });
})();

/**
 * 随机时间
 */
function randomDate() {
    var maxdaterandom = new Date().getTime();
    var mindaterandom = new Date(2020, 0, 1, 8).getTime();
    var randomdate = getRandom(mindaterandom, maxdaterandom);
    var datestr = moment(randomdate).format('YYYY-MM-DD HH:mm:ss');
    return datestr;
}

/**
 * 随机姓名
 */
function randomName() {
    const surname = `王,李,张,刘,陈,杨,黄,赵,吴,周,徐,孙,马,朱,胡,郭,何,高,林,郑,谢,罗,梁,宋,唐,许,韩,冯,邓,曹,彭,曾,肖,田,董,袁,潘,于,蒋,蔡,余,杜,叶,程,苏,魏,吕,丁,任,沈, 姚,卢,姜,崔,钟,谭,陆,汪,范,金,石,廖,贾,夏,韦,付,方,白,邹,孟,熊,秦,邱,江,尹,薛,闫,段,雷,侯,龙,史,陶,黎,贺,顾, 毛,郝,龚,邵,万,钱,严,覃,武,戴,莫,孔,向,汤`.split(
        ','
    );
    const givenname = `子璇,淼,国栋,夫子,瑞堂,甜,敏,尚,国贤,贺祥,晨涛,昊轩,易轩,益辰,益帆,益冉,瑾春,瑾昆,春齐,杨,文昊,东东,雄霖,浩晨,熙涵,溶溶,冰枫,欣欣,宜豪,欣慧,建政,美欣,淑慧,文轩,文杰,欣源,忠林,榕润,欣汝,慧嘉,新建,建林,亦菲,林,冰洁,佳欣,涵涵,禹辰,淳美,泽惠,伟洋,涵越,润丽,翔,淑华,晶莹,凌晶,苒溪,雨涵,嘉怡,佳毅,子辰,佳琪,紫轩,瑞辰,昕蕊,萌,明远,欣宜,泽远,欣怡,佳怡,佳惠,晨茜,晨璐,运昊,汝鑫,淑君,晶滢,润莎,榕汕,佳钰,佳玉,晓庆,一鸣,语晨,添池,添昊,雨泽,雅晗,雅涵,清妍,诗悦,嘉乐,晨涵,天赫,玥傲,佳昊,天昊,萌萌,若萌`.split(
        ','
    );
    return (
        surname[getRandom(0, surname.length - 1)] +
        givenname[getRandom(0, givenname.length - 1)]
    );
}

/**
 * 随机车辆类型
 */
function randomCarName() {
    const carName = `奥迪,奔驰,宝马,保时捷,巴博斯,宝沃,大众,卡尔森,欧宝,泰卡特,本田,丰田,光冈,铃木,雷克萨斯,朗世,马自达,讴歌,日产三菱,斯巴鲁,五十铃,英菲尼迪,起亚,双龙,现代别克,道奇,福特,jeep,凯迪拉克,克莱斯勒,林肯,乔治·巴顿,山姆,特斯拉,雷诺,雪铁龙,阿斯顿·马丁,宾利,捷豹,路虎,劳斯莱斯,路特斯,迈凯伦,阿尔法·罗密欧,布加迪,法拉利,菲亚特,兰博基尼,玛莎拉蒂,帕加尼依维柯,科尼赛克,沃尔沃,斯柯达比亚迪,宝骏,北汽幻速,奔腾,北汽绅宝,北汽威旺,北汽制造,北京,北汽新能源,长安商用,昌河,长安跨越,长城华冠,成功,东风风行,东南,东风风神,东风小康,东风·郑州日产,东风风度,东风御风,福田,福迪,福汽启腾,飞驰商务车,广汽传祺,观致汽车,哈弗,海马,红旗,华泰,黄海,哈飞,海马商用车,华颂,恒天汽车,海格,汇众江淮,吉利汽车,江铃,金杯,九龙,江南,开瑞,凯翼`.split(
        ','
    );
    return carName[getRandom(0, carName.length - 1)];
}

/**
 * 随机车牌号
 */
function randomCarNumber() {
    const s1 = `冀A,冀B,冀C,冀D,冀E,冀F,冀G,冀H,冀I,冀J,冀K,京A,京B,京C,京D,京E,京F,京G,蒙A,蒙B,蒙C,蒙D,蒙E,蒙F,蒙G,蒙H,蒙I,蒙J,蒙K,豫A,豫B,豫C,豫D,豫E,豫F,豫G,豫H,豫I,豫J,豫K,云A,云B,云C,云D,云E,云F,云G,云H,云I,云J,云K,云L,云M,云N,辽A,辽B,辽C,辽D,辽E,辽F,辽G,辽H,辽I,辽J,辽K,黑A,黑B,黑C,黑D,黑E,黑F,黑G,黑H,黑I,黑J,黑K,黑M,黑L`.split(
        ','
    );
    return `${s1[getRandom(0, s1.length - 1)]}·${(
        getRandom(0, 99999) + ''
    ).padStart(5, '0')}`;
}

/**
 * 获取普通用户消费项目
 */
function getCommonServeOptions() {
    const commonServeOptions = [
        ['洗车（轿车）', 30],
        ['洗车（SUV/越野）', 35],
        ['洗车（七座越野）', 40],
        ['洗车（商务/面包车）', 40],
        ['微镀晶', 120],
        ['精洗', 100],
        ['内饰精洗', 380],
        ['打蜡', 100],
        ['普通封釉', 180],
        ['精致封釉', 480],
        ['抛光', 380],
        ['镀晶', 800],
        ['琉晶', 1280],
    ];
    return commonServeOptions[getRandom(0, commonServeOptions.length - 1)];
}

/**
 * 获取会员用户消费项目
 */
function getMemberServeOptions() {
    const memberServeOptions = [
        ['洗车（轿车）', 25],
        ['洗车（SUV/越野）', 30],
        ['洗车（七座越野）', 35],
        ['洗车（商务/面包车）', 35],
        ['微镀晶', 100],
        ['精洗', 70],
        ['内饰精洗', 280],
        ['打蜡', 50],
        ['普通封釉', 100],
        ['精致封釉', 350],
        ['抛光', 300],
        ['镀晶', 600],
        ['琉晶', 1000],
    ];
    return memberServeOptions[getRandom(0, memberServeOptions.length - 1)];
}

/**
 * 获取充值记录
 */
function getRandomRechargeRecord() {
    const sums = [
        100,
        200,
        300,
        500,
        600,
        700,
        800,
        900,
        1000,
        1200,
        1500,
        1800,
        2000,
        2500,
        3000,
        5000,
    ];

    return [randomDate(), sums[getRandom(0, sums.length - 1)], randomTerrace()];
}

function getRandomRemark() {
    const femarks = `有志者自有千计万计,无志者只感千难万难,,实现自己既定的目标,必须能耐得住寂寞单干,,世界会向那些有目标和远见的人让路,必须从过去的错误学习教训而非依赖过去的成功,美丽的花虽然会凋谢,可是盛开的时刻值得欣赏,要在美好的时候创造出美好的东西,人生才会充满意义,失败只是暂时停止成功,假如我不能,我就一定要；假如我要,我就一定能！,让我们将事前的忧虑,换为事前的思考和计划吧！,不论你在什么时候开始,重要的是开始之后就不要停止,永不言败,是成功者的最佳品格,一个人的快乐,不是因为他拥有的多,而是因为他计较的少,生气,就是拿别人的过错来惩罚自己,原谅别人,就是善待自己,未必钱多乐便多,财多累己招烦恼,清贫乐道真自在,无牵无挂乐逍遥,处事不必求功,无过便是功,为人不必感德,无怨便是德,平安是幸,知足是福,清心是禄,寡欲是寿,人之心胸,多欲则窄,寡欲则宽,宁可清贫自乐,不可浊富多忧,受思深处宜先退,得意浓时便可休,势不可使尽,福不可享尽,便宜不可占尽,聪明不可用尽,滴水穿石,不是力量大,而是功夫深,必须不断汲取专业知识但不要以专家自居以专家自居的想法会损害产生新思想,运用新思想的能力,要接受自己行动所带来的责任而非自己成就所带来的荣耀,每个人都必须发展两种重要的能力适应改变与动荡的能力以及为长期目标延缓享乐的能力,将一付好牌打好没有什么了不起能将一付坏牌打好的人才值得钦佩,一切事无法追求完美,唯有追求尽力而为,这样心无压力,出来的结果反而会更好,心作良田耕不尽,善为至宝用无穷,我们应有纯洁的心灵,去积善为大众,就会获福无边,打击与挫败是成功的踏脚石,而不是绊脚石,生命不是要超越别人,而是要超越自己,人生最大的喜悦是每个人都说你做不到,你却完成它了！,不为模糊不清的未来担忧,只为清清楚楚的现在努力,当你停止尝试时,就是失败的时候,生命对某些人来说是美丽的,这些人的一生都为某个目标而奋斗,推销产品要针对顾客的心,不要针对顾客的头,不同的信念,决定不同的命运！,成功这件事,自己才是老板！,失败的是事,绝不应是人,自己打败自己是最可悲的失败,自己战胜自己是最可贵的胜利,从来不跌倒不算光彩,每次跌倒后能再站起来,才是最大的荣耀,失败只有一种,那就是半途而废,平生不做皱眉事,世上应无切齿人,须交有道之人,莫结无义之友,饮清静之茶,莫贪花色之酒,开方便之门,闲是非之口,世事忙忙如水流,休将名利挂心头,粗茶淡饭随缘过,富贵荣华莫强求,“我欲”是贫穷的标志,事能常足,心常惬,人到无求品自高,人生至恶是善谈人过；人生至愚恶闻己过,诸恶莫做,众善奉行,莫以善小而不为,莫以恶小而为之,莫妒他长,妒长,则己终是短,莫护己短,护短,则己终不长,是非天天有,不听自然无,五官刺激,不是真正的享受,内在安祥,才是下手之处,人为善,福虽未至,祸已远离；人为恶,祸虽未至,福已远离,不妄求,则心安,不妄做,则身安,不自重者,取辱,不自长者,取祸,不自满者,受益,不自足者,博闻,积金遗于子孙,子孙未必能守；积书于子孙,子孙未必能读,不如积阴德于冥冥之中,此乃万世传家之宝训也,积德为产业,强胜于美宅良田,能付出爱心就是福,能消除烦恼就是慧,身安不如心安,屋宽不如心宽,罗马人凯撒大帝,威震欧亚非三大陆,临终告诉侍者说：“请把我的双手放在棺材外面,让世人看看,伟大如我凯撒者,死后也是两手空空,当你无法从一楼蹦到三楼时,不要忘记走楼梯,要记住伟大的成功往往不是一蹴而就的,必须学会分解你的目标,逐步实施,成功源于不懈的努力,要诚恳,要坦然,要慷慨,要宽容,要有平常心,开始努力吧！在这个过程中你必须放弃很多东西,但你要明白它们都不是你最终想要的,你要相信在你成功以后,总有一天它们会再回来,而且比现在更美好！,做决定之前仔细考虑,一旦作了决定就要勇往直前,坚持到底,常自认为是福薄的人,任何不好的事情发生都合情合理,有这样平常心态,将会战胜很多困难,君子之交淡如水,要有好脾气和仁义广结好缘,多结识良友,那是积蓄无形资产,很多成功就是来源于无形资产,一棵大树经过一场雨之后倒了下来,原来是根基短浅,我们做任何事都要打好基础,才能坚固不倒,同样一件事情的发生,有的人感到非常痛苦,有的人却能坦然接受,因为这两者的忍耐能力不同,有忍耐能力的人才容易成功,人生舞台的大幕随时都可能拉开,关键是你愿意表演,还是选择躲避,人生只有经历酸甜苦辣,才懂得人间的味道,因此也必须学会珍惜人生和珍惜感情,人们最害怕的是无常变化,要学习适应环境的变化和变化中另谋创新,并不是停留在变化的痛苦中,心灵激情不在,就可能被打败,凡事不要说“我不会”或“不可能”,因为你根本还没有去做！,成功不是凭梦想和希望,而是凭努力和实践,上帝说：你要什么便取什么,但是要付出相当的代价,目标的坚定是性格中最必要的力量源泉之一,也是成功的利器之一,没有它,天才会在矛盾无定的迷径中徒劳无功,当你无法从一楼蹦到三楼时,不要忘记走楼梯,要记住伟大的成功往往不是一蹴而就的,必须学会分解你的目标,逐步实施,无论你觉得自己多么的了不起,也永远有人比你更强,没有播种,何来收获；没有辛苦,何来成功；没有磨难,何来荣耀；没有挫折,何来辉煌,相信就是强大,怀疑只会抑制能力,而信仰就是力量,一个人除非自己有信心,否则带给别人信心,除非想成为一流,否则就是二流,在你内心深处,还有无穷的潜力,有一天当你回首看时,你就会知道这绝对是真的,成功,往往住在失败的隔壁！,宁可辛苦一阵子,不要苦一辈子,为成功找方法,不为失败找借口,蔚蓝的天空虽然美丽,经常风云莫测的人却是起落无从,但他往往会成为风云人物,因为他经得起大风大浪的考验,决不能放弃,世界上没有失败,只有放弃,请记得,好朋友的定义是：你混的好,她打心眼里为你开心；你混的不好,她由衷的为你着急,要有梦想,即使遥远,努力爱一个人,付出,不一定会有收获；不付出,却一定不会有收获,不要奢望出现奇迹,承诺是一件美好的事情,但美好的东西往往不会变为现实,每个人都有自己鲜明的主张和个性,不要识途去改变他人,同样,也不要被他人所改变,改了,就不是自己了,没有十全十美的东西,没有十全十美的人,关键是清楚到底想要什么,得到想要的,肯定会失去另外一部分,如果什么都想要,只会什么都得不到,这个世界最脆弱的是生命,身体健康,很重要,现在站在什么地方不重要,重要的是你往什么方向移动？,对一个年轻人而言最重要的是个人价值的增加,失去金钱的人损失甚少,失去健康的人损失极多,失去勇气的人损失一切,你必须百分之百的把自己推销给自己,老天爷对每个人都是公平的,不要试图控制别人,不要要求别人理解你,活在当下,别在怀念过去或者憧憬未来中浪费掉你现在的生活,不要忘本,任何时候,任何事情,欲望以提升热忱,毅力以磨平高山`.split(
        ','
    );
    return femarks[getRandom(0, femarks.length - 1)];
}

/**
 * 随机支付平台
 */
function randomTerrace() {
    const terrace = ['微信', '支付宝', '现金', '其他'];
    return terrace[getRandom(0, terrace.length - 1)];
}

/**
 * 区间随机数
 * @param {number} min 最小数
 * @param {number} max 最大数
 */
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
