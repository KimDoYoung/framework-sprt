package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryParam;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sms/mapper/sms04_group_send_history.xml */
@Mapper
public interface SmsGroupSendHistoryMapper {
    /** AS-IS selectByText */
    List<GroupSendHistoryRes> selectByText(GroupSendHistoryParam param);

    /** AS-IS insert — SendSMSAPI.smsGroupSender L139-149가 발송 성공 뒤 남기는 기록(ID는 dbConfig.getEtcSeq, 일시는 지금, 비고 없음) */
    int insertHistory(@Param("companyId") Long companyId, @Param("groupSendId") Long groupSendId,
                      @Param("targetTelNo") String targetTelNo, @Param("targetName") String targetName, @Param("content") String content);
}
