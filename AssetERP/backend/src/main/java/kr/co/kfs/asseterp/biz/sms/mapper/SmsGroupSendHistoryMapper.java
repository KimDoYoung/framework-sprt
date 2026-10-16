package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryParam;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/sms/mapper/sms04_group_send_history.xml */
@Mapper
public interface SmsGroupSendHistoryMapper {
    /** AS-IS selectByText */
    List<GroupSendHistoryRes> selectByText(GroupSendHistoryParam param);
}
