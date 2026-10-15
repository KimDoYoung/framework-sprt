package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.GroupSendRes;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sms/mapper/sms03_group_send.xml + UpdateDataModel(sms03_group_send) — yunhee port-save로 옮김 */
@Mapper
public interface SmsGroupSendMapper {
    /** AS-IS selectByCompanyId */
    List<GroupSendRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS selectById (회사 조건 추가) */
    GroupSendRes selectById(@Param("groupSendId") Long groupSendId, @Param("companyId") Long companyId);

    /** AS-IS Client insertRow의 LoginUser.getToday() */
    LocalDate selectToday();

    Long selectNextId();

    int insertGroupSend(@Param("groupSendId") Long groupSendId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("req") GroupSendSaveReq req);

    int updateGroupSend(@Param("companyId") Long companyId, @Param("req") GroupSendSaveReq req);

    int deleteGroupSends(@Param("companyId") Long companyId, @Param("groupSendIds") List<Long> groupSendIds);
}
