package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoRes;
import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys85_client_info.xml + UpdateDataModel(sys85_client_info) — yunhee port-save로 옮김 */
@Mapper
public interface SysClientInfoMapper {
    /** AS-IS selectByText (searchText는 LIKE 패턴) */
    List<ClientInfoRes> selectByText(@Param("searchText") String searchText);

    ClientInfoRes selectById(@Param("clientInfoId") Long clientInfoId);

    Long selectNextId();

    int insertClientInfo(@Param("clientInfoId") Long clientInfoId, @Param("req") ClientInfoSaveReq req);

    int updateClientInfo(@Param("req") ClientInfoSaveReq req);

    int deleteClientInfos(@Param("clientInfoIds") List<Long> clientInfoIds);
}
