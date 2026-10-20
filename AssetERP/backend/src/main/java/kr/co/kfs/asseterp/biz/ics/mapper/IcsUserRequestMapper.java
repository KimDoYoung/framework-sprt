package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.UserRequestMyReq;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestRes;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ics/mapper/ics17_user_request.xml + UpdateDataModel(ics17_user_request) */
@Mapper
public interface IcsUserRequestMapper {
    /** AS-IS selectBySearchTextAdmin (companyText·confirmYn·stateCode·searchText는 LIKE 패턴) */
    List<UserRequestRes> selectBySearchTextAdmin(@Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                                 @Param("searchText") String searchText, @Param("stateCode") String stateCode,
                                                 @Param("confirmYn") String confirmYn, @Param("completeYn") String completeYn,
                                                 @Param("companyText") String companyText);

    /** AS-IS selectBySearchText (searchText·stateCode·confirmYn은 LIKE 패턴) — 로그인 회사의 신청만 */
    List<UserRequestRes> selectBySearchText(@Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                            @Param("searchText") String searchText, @Param("stateCode") String stateCode,
                                            @Param("confirmYn") String confirmYn, @Param("companyId") Long companyId);

    Long selectNextId();

    int insertUserRequest(@Param("userRequestId") Long userRequestId, @Param("companyId") Long companyId,
                          @Param("personId") Long personId, @Param("req") UserRequestMyReq req);

    int updateMyUserRequest(@Param("userRequestId") Long userRequestId, @Param("companyId") Long companyId,
                            @Param("req") UserRequestMyReq req);

    int deleteMyUserRequest(@Param("userRequestId") Long userRequestId, @Param("companyId") Long companyId);

    UserRequestRes selectById(@Param("userRequestId") Long userRequestId);

    int updateUserRequest(@Param("userRequestId") Long userRequestId, @Param("req") UserRequestSaveReq req);

    /** AS-IS updateLawContent */
    int updateLawContent(@Param("userRequestId") Long userRequestId, @Param("lawContent") String lawContent);
}
